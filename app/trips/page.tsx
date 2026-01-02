import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getTripsForUser(userEmail: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        Trip: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: {
                expenses: true,
                participants: true,
              },
            },
          },
        },
      },
    });

    return user?.Trip || [];
  } catch (error) {
    console.error('[Trips Page] Error fetching trips:', error);
    return [];
  }
}

function getCurrencyFlag(currency: string): string {
  const flags: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    ILS: '🇮🇱',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    THB: '🇹🇭',
    AUD: '🇦🇺',
    CAD: '🇨🇦',
    CHF: '🇨🇭',
  };
  return flags[currency] || '💱';
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function TripsPage() {
  const session = await auth();

  // TODO: Remove fallback when auth is working
  // For now, use demo user
  const userEmail = session?.user?.email || 'demo@example.com';

  if (!userEmail) {
    redirect('/');
  }

  const trips = await getTripsForUser(userEmail);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                הטיולים שלי
              </h1>
              <p className="text-gray-600">
                {session?.user?.email ? (
                  <>מחובר כ-{session.user.email}</>
                ) : (
                  <>משתמש demo</>
                )}
              </p>
            </div>
            <Link
              href="/"
              className="px-6 py-3 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all text-gray-700 font-medium"
            >
              ← דף הבית
            </Link>
          </div>
          
          {trips.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-6 text-center">
                <div className="flex-1">
                  <div className="text-3xl font-bold text-cyan-600">
                    {trips.length}
                  </div>
                  <div className="text-sm text-gray-600">טיולים</div>
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-blue-600">
                    {trips.reduce((sum, trip) => sum + trip._count.expenses, 0)}
                  </div>
                  <div className="text-sm text-gray-600">הוצאות</div>
                </div>
                <div className="flex-1">
                  <div className="text-3xl font-bold text-purple-600">
                    {trips.reduce((sum, trip) => sum + trip._count.participants, 0)}
                  </div>
                  <div className="text-sm text-gray-600">משתתפים</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <div className="text-center py-20">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center">
              <span className="text-6xl">✈️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">
              אין טיולים עדיין
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              התחל לתכנן את הטיול הבא שלך! צור טיול חדש ועקוב אחרי כל ההוצאות והתקציב.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-xl hover:shadow-2xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              צור טיול חדש
            </Link>
          </div>
        )}

        {/* Trips Grid */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Link
                key={trip.id}
                href={`/trips/${trip.id}`}
                className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Card Header with Gradient */}
                <div className="h-32 bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20 group-hover:scale-110 transition-transform">
                      {getCurrencyFlag(trip.baseCurrency)}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                    {trip.baseCurrency}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-cyan-600 transition-colors line-clamp-1">
                    {trip.name}
                  </h3>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(trip.startDate)}</span>
                      {trip.endDate && (
                        <>
                          <span className="text-gray-400">→</span>
                          <span>{formatDate(trip.endDate)}</span>
                        </>
                      )}
                    </div>

                    {trip.travelStyle && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="capitalize">{trip.travelStyle}</span>
                      </div>
                    )}

                    {trip.description && (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-3">
                        {trip.description}
                      </p>
                    )}
                  </div>

                  {/* Stats Footer */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-lg">💰</span>
                      <span className="text-gray-700 font-medium">
                        {trip._count.expenses}
                      </span>
                      <span className="text-gray-500">הוצאות</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <span className="text-lg">👥</span>
                      <span className="text-gray-700 font-medium">
                        {trip._count.participants}
                      </span>
                      <span className="text-gray-500">משתתפים</span>
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <div className="flex items-center justify-end mt-4 text-cyan-600 group-hover:text-cyan-700">
                    <span className="text-sm font-medium ml-2">צפה בפרטים</span>
                    <svg 
                      className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

