import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import TripExpenses from '@/components/TripExpenses';

export const dynamic = 'force-dynamic';

async function getTripWithDetails(tripId: string, userEmail: string) {
  try {
    // First, get the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return null;
    }

    // Then get the trip, ensuring it belongs to this user
    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId,
        userId: user.id,
      },
      include: {
        expenses: {
          orderBy: { date: 'desc' },
          include: {
            paidBy: true,
            shares: {
              include: {
                participant: true,
              },
            },
          },
        },
        participants: {
          orderBy: { createdAt: 'asc' },
        },
        transfers: {
          orderBy: { date: 'desc' },
          include: {
            fromParticipant: true,
            toParticipant: true,
          },
        },
      },
    });

    return trip;
  } catch (error) {
    console.error('[Trip Details] Error fetching trip:', error);
    return null;
  }
}

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    ILS: '₪',
    GBP: '£',
    JPY: '¥',
    THB: '฿',
  };
  return symbols[currency] || currency;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface PageProps {
  params: Promise<{ tripId: string }>;
}

export default async function TripDetailsPage({ params }: PageProps) {
  const { tripId } = await params;
  const session = await auth();

  // TODO: Remove fallback when auth is working
  const userEmail = session?.user?.email || 'demo@example.com';

  if (!userEmail) {
    redirect('/');
  }

  const trip = await getTripWithDetails(tripId, userEmail);

  if (!trip) {
    notFound();
  }

  // Calculate totals
  const totalExpenses = trip.expenses.reduce(
    (sum, expense) => sum + Number(expense.amount),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 mb-4 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            חזרה לכל הטיולים
          </Link>

          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{trip.name}</h1>
                  {trip.description && (
                    <p className="text-cyan-50 text-lg">{trip.description}</p>
                  )}
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <div className="text-2xl font-bold">{trip.baseCurrency}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-cyan-100 text-sm mb-1">תאריך התחלה</div>
                  <div className="font-semibold">{formatDate(trip.startDate)}</div>
                </div>
                {trip.endDate && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-cyan-100 text-sm mb-1">תאריך סיום</div>
                    <div className="font-semibold">{formatDate(trip.endDate)}</div>
                  </div>
                )}
                {trip.travelStyle && (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="text-cyan-100 text-sm mb-1">סגנון טיול</div>
                    <div className="font-semibold capitalize">{trip.travelStyle}</div>
                  </div>
                )}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-cyan-100 text-sm mb-1">סה"כ הוצאות</div>
                  <div className="font-bold text-lg">
                    {formatCurrency(totalExpenses, trip.baseCurrency)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {trip.expenses.length}
                </div>
                <div className="text-sm text-gray-600">הוצאות</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">👥</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {trip.participants.length}
                </div>
                <div className="text-sm text-gray-600">משתתפים</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {trip.transfers.length}
                </div>
                <div className="text-sm text-gray-600">העברות</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Expenses with Add Form */}
          <TripExpenses 
            trip={{
              id: trip.id,
              name: trip.name,
              baseCurrency: trip.baseCurrency,
            }}
            initialExpenses={trip.expenses.map((expense) => ({
              id: expense.id,
              amount: Number(expense.amount),
              currency: expense.currency,
              category: expense.category,
              description: expense.description,
              notes: expense.notes,
              date: expense.date,
              paidBy: {
                id: expense.paidBy.id,
                name: expense.paidBy.name,
                email: expense.paidBy.email,
              },
            }))}
          />

          {/* Participants */}
          {trip.participants.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>👥</span>
                משתתפים בטיול
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trip.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {participant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {participant.name}
                      </div>
                      {participant.email && (
                        <div className="text-sm text-gray-500" dir="ltr">
                          {participant.email}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transfers */}
          {trip.transfers.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔄</span>
                העברות כספים
              </h2>
              <div className="space-y-3">
                {trip.transfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600">
                          {transfer.fromParticipant.name}
                        </div>
                        <div className="text-xs text-gray-400">מעביר</div>
                      </div>
                      <div className="text-2xl">→</div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">
                          {transfer.toParticipant.name}
                        </div>
                        <div className="text-xs text-gray-400">מקבל</div>
                      </div>
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">
                        {formatCurrency(Number(transfer.amount), transfer.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatDate(transfer.date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

