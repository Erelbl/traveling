import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Validation schema
const createExpenseSchema = z.object({
  tripId: z.string().min(1, 'Trip ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().length(3, 'Currency must be 3 letters'),
  category: z.enum([
    'flights',
    'accommodation',
    'food',
    'transportation',
    'attractions',
    'insurance',
    'shopping',
    'miscellaneous',
  ]),
  description: z.string().min(1, 'Description is required').max(200),
  notes: z.string().optional(),
  date: z.string().optional(),
  paidById: z.string().optional(), // If not provided, create a default participant
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    
    // TODO: Remove fallback when auth is working
    let userEmail: string;
    
    if (!session?.user?.email) {
      console.warn('[API] No session found, using demo user');
      userEmail = 'demo@example.com';
    } else {
      userEmail = session.user.email;
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    
    if (!user) {
      // Create demo user if doesn't exist
      user = await prisma.user.create({
        data: {
          email: userEmail,
          name: 'Demo User',
        },
      });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createExpenseSchema.parse(body);

    // Verify trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: {
        id: validatedData.tripId,
        userId: user.id,
      },
      include: {
        participants: true,
      },
    });

    if (!trip) {
      return NextResponse.json(
        {
          success: false,
          error: 'Trip not found or unauthorized',
        },
        { status: 404 }
      );
    }

    // Get or create a participant for this expense
    let paidById = validatedData.paidById;
    
    if (!paidById) {
      // Check if there's a default participant
      let defaultParticipant = trip.participants.find(
        (p) => p.email === userEmail || p.name === 'Me'
      );
      
      if (!defaultParticipant) {
        // Create a default participant
        defaultParticipant = await prisma.participant.create({
          data: {
            tripId: trip.id,
            name: user.name || 'Me',
            email: userEmail,
          },
        });
      }
      
      paidById = defaultParticipant.id;
    }

    // Create expense
    const expense = await prisma.expense.create({
      data: {
        tripId: validatedData.tripId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        category: validatedData.category,
        description: validatedData.description,
        notes: validatedData.notes || null,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        paidById,
        splitMethod: 'EQUAL', // Default split method
      },
      include: {
        paidBy: true,
      },
    });

    console.log('[API] Expense created:', expense.id);

    return NextResponse.json({
      success: true,
      expense,
    });

  } catch (error) {
    console.error('[API] Error creating expense:', error);

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
        error: 'Failed to create expense',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET /api/expenses?tripId=xxx - List expenses for a trip
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email || 'demo@example.com';

    const { searchParams } = new URL(request.url);
    const tripId = searchParams.get('tripId');

    if (!tripId) {
      return NextResponse.json(
        { success: false, error: 'Trip ID is required' },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify trip belongs to user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: user.id,
      },
    });

    if (!trip) {
      return NextResponse.json(
        { success: false, error: 'Trip not found or unauthorized' },
        { status: 404 }
      );
    }

    // Get expenses
    const expenses = await prisma.expense.findMany({
      where: { tripId },
      orderBy: { date: 'desc' },
      include: {
        paidBy: true,
        shares: {
          include: {
            participant: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      expenses,
    });

  } catch (error) {
    console.error('[API] Error fetching expenses:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch expenses',
      },
      { status: 500 }
    );
  }
}

