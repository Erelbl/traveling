import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// Prisma v7 requires adapter for Neon database
const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('[Prisma] Creating client with DATABASE_URL:', databaseUrl ? '✓ Present' : '✗ Missing');
  console.log('[Prisma] DATABASE_URL starts with:', databaseUrl?.substring(0, 20) + '...');
  
  // Check DATABASE_URL exists
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not defined. Please add it to your .env or .env.local file.'
    );
  }

  // Validate DATABASE_URL format
  if (!databaseUrl.startsWith('postgres://') && !databaseUrl.startsWith('postgresql://')) {
    throw new Error(
      `Invalid DATABASE_URL format. Expected postgresql://... but got: ${databaseUrl.substring(0, 20)}...`
    );
  }

  console.log('[Prisma] Creating Neon Pool with connection string');
  
  // Reuse pool in development to avoid multiple connections
  let pool = globalForPrisma.pool;
  
  if (!pool) {
    pool = new Pool({ 
      connectionString: databaseUrl,
    });
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.pool = pool;
    }
    
    console.log('[Prisma] New Neon Pool created');
  } else {
    console.log('[Prisma] Reusing existing Neon Pool');
  }
  
  // Create Neon adapter
  const adapter = new PrismaNeon(pool)
  
  console.log('[Prisma] PrismaClient created successfully');
  
  // Return PrismaClient with adapter
  return new PrismaClient({ 
    adapter,
    log: ['error', 'warn'],
  })
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

