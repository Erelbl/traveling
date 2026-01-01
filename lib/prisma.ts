import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

// Check DATABASE_URL immediately on module load
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

console.log('[Prisma] ✓ DATABASE_URL loaded:', DATABASE_URL.substring(0, 25) + '...');

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
  connectionString: string | undefined
}

// Create a stable connection pool
const createOrGetPool = () => {
  // Get DATABASE_URL fresh every time to ensure it's always available
  const currentUrl = process.env.DATABASE_URL || DATABASE_URL;
  
  if (!currentUrl) {
    throw new Error('DATABASE_URL is not available at runtime!');
  }
  
  // If we have a cached pool AND the connection string hasn't changed, reuse it
  if (globalForPrisma.pool && globalForPrisma.connectionString === currentUrl) {
    console.log('[Prisma] Reusing existing Neon Pool');
    return globalForPrisma.pool;
  }

  console.log('[Prisma] Creating new Neon Pool');
  console.log('[Prisma] Connection string present:', !!currentUrl);
  
  // Configure Neon for Node.js environment
  neonConfig.fetchConnectionCache = true;
  
  // Create new pool with explicit connection string
  const pool = new Pool({ 
    connectionString: currentUrl,
  });
  
  // Cache it for reuse in development
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.pool = pool;
    globalForPrisma.connectionString = currentUrl;
  }
  
  return pool;
};

// Prisma v7 requires adapter for Neon database
const createPrismaClient = () => {
  console.log('[Prisma] Creating PrismaClient...');
  
  const pool = createOrGetPool();
  const adapter = new PrismaNeon(pool);
  
  console.log('[Prisma] ✓ PrismaClient created successfully');
  
  return new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

