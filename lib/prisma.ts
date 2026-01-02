import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

// Configure Neon to use WebSocket (fixes Turbopack/Next.js 16 bundling issues)
neonConfig.webSocketConstructor = ws

// Get DATABASE_URL - this runs at module load time
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    '❌ DATABASE_URL is not defined!\n' +
    'Please create .env.local in project root with:\n' +
    'DATABASE_URL="postgresql://..."\n\n' +
    'See SETUP_ENV_INSTRUCTIONS.md for details.'
  );
}

if (!DATABASE_URL.startsWith('postgres://') && !DATABASE_URL.startsWith('postgresql://')) {
  throw new Error(
    `❌ Invalid DATABASE_URL format!\n` +
    `Expected: postgresql://...\n` +
    `Got: ${DATABASE_URL.substring(0, 30)}...\n\n` +
    `Check your .env.local file.`
  );
}

console.log('[Prisma] ✓ DATABASE_URL loaded:', DATABASE_URL.substring(0, 30) + '...');
console.log('[Prisma] Using WebSocket for Neon connection (Turbopack workaround)');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Create a SINGLE pool with the connection string at module load time
const pool = new Pool({ connectionString: DATABASE_URL });
console.log('[Prisma] ✓ Neon Pool created at module load');

// Create PrismaClient
const createPrismaClient = () => {
  console.log('[Prisma] Creating PrismaClient with Neon adapter (WebSocket mode)');
  
  const adapter = new PrismaNeon(pool);
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

console.log('[Prisma] ✓ PrismaClient ready');

