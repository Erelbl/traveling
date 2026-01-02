import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Configure Neon to use WebSocket (fixes Turbopack/Next.js 16 bundling issues)
neonConfig.webSocketConstructor = ws

// Get DATABASE_URL - this runs at module load time
// Force reload from process.env every time to avoid caching issues
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  
  if (!url) {
    console.error('[Prisma] ❌ DATABASE_URL is missing!');
    console.error('[Prisma] Available env keys:', Object.keys(process.env).filter(k => k.includes('DATABASE')));
    throw new Error(
      '❌ DATABASE_URL is not defined!\n' +
      'Please create .env.local in project root with:\n' +
      'DATABASE_URL="postgresql://..."\n\n'
    );
  }

  if (!url.startsWith('postgres://') && !url.startsWith('postgresql://')) {
    throw new Error(
      `❌ Invalid DATABASE_URL format!\n` +
      `Expected: postgresql://...\n` +
      `Got: ${url.substring(0, 30)}...\n\n` +
      `Check your .env.local file.`
    );
  }

  return url;
}

const DATABASE_URL = getDatabaseUrl();
console.log('[Prisma] ✓ DATABASE_URL loaded:', DATABASE_URL.substring(0, 30) + '...');
console.log('[Prisma] Using WebSocket for Neon connection (Turbopack workaround)');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  connectionString: string | undefined
}

// Create or reuse pool
function getOrCreatePool(): Pool {
  if (globalForPrisma.pool && globalForPrisma.connectionString === DATABASE_URL) {
    console.log('[Prisma] Reusing existing Neon Pool');
    return globalForPrisma.pool;
  }

  console.log('[Prisma] Creating new Neon Pool');
  const pool = new Pool({ connectionString: DATABASE_URL });
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
    globalForPrisma.connectionString = DATABASE_URL;
  }
  
  return pool;
}

// Create PrismaClient
const createPrismaClient = () => {
  console.log('[Prisma] Creating PrismaClient with Neon adapter (WebSocket mode)');
  
  const pool = getOrCreatePool();
  const adapter = new PrismaNeon(pool);
  
  const client = new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
  
  console.log('[Prisma] ✓ PrismaClient ready');
  return client;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

