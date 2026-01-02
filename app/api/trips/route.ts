import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const createTripSchema = z.object({
  name: z.string().min(1, 'Trip name is required').max(100),
  baseCurrency: z.string().length(3, 'Currency must be 3 letters (e.g., USD)'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  travelStyle: z.string().optional(),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    // TODO: Remove this fallback when auth is working
    // For now, use a temporary user
    let userId: string;
    
    if (!session?.user?.email) {
      // Temporary: Create or get a demo user
      console.warn('[API] No session found, using demo user');
      
      let demoUser = await prisma.user.findUnique({
        where: { email: 'demo@example.com' },
      });
      
      if (!demoUser) {
        demoUser = await prisma.user.create({
          data: {
            email: 'demo@example.com',
            name: 'Demo User',
          },
        });
      }
      
      userId = demoUser.id;
    } else {
      // Get or create user from session
      let user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: session.user.email,
            name: session.user.name || null,
          },
        });
      }
      
      userId = user.id;
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createTripSchema.parse(body);

    // Create trip in database
    const trip = await prisma.trip.create({
      data: {
        userId,
        name: validatedData.name,
        baseCurrency: validatedData.baseCurrency,
        startDate: validatedData.startDate 
          ? new Date(validatedData.startDate) 
          : new Date(),
        endDate: validatedData.endDate 
          ? new Date(validatedData.endDate) 
          : null,
        travelStyle: validatedData.travelStyle || null,
        description: validatedData.description || null,
      },
    });

    console.log('[API] Trip created:', trip.id);

    return NextResponse.json({
      success: true,
      trip,
    });

  } catch (error) {
    console.error('[API] Error creating trip:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create trip',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/trips - List all trips for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    // TODO: Remove this fallback when auth is working
    let userId: string;
    
    if (!session?.user?.email) {
      const demoUser = await prisma.user.findUnique({
        where: { email: 'demo@example.com' },
      });
      
      if (!demoUser) {
        return NextResponse.json({ success: true, trips: [] });
      }
      
      userId = demoUser.id;
    } else {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      
      if (!user) {
        return NextResponse.json({ success: true, trips: [] });
      }
      
      userId = user.id;
    }

    const trips = await prisma.trip.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: {
            expenses: true,
            participants: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      trips,
    });

  } catch (error) {
    console.error('[API] Error fetching trips:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch trips',
      },
      { status: 500 }
    );
  }
}

