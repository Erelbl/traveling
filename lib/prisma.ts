import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Prisma v7 with prisma.config.ts - pass empty object to constructor
const createPrismaClient = () => {
  // Check DATABASE_URL exists
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'DATABASE_URL is not defined. Please add it to your .env or .env.local file.'
    );
  }

  // In Prisma v7 with prisma.config.ts, pass empty options object
  return new PrismaClient({});
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

