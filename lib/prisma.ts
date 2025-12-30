import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma v7 requires adapter for Neon database
const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL;
  
  console.log('[Prisma] Creating client with DATABASE_URL:', databaseUrl ? '✓ Present' : '✗ Missing');
  
  // Check DATABASE_URL exists
  if (!databaseUrl) {
    throw new Error(
      'DATABASE_URL is not defined. Please add it to your .env or .env.local file.'
    );
  }

  console.log('[Prisma] Creating Neon Pool with connection string');
  
  // Create Neon connection pool with explicit connection string
  const pool = new Pool({ connectionString: databaseUrl })
  
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

