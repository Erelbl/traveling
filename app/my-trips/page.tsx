'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Trip {
  id: string;
  name: string;
  baseCurrency: string;
  startDate: string;
  endDate: string | null;
  travelStyle: string | null;
  description: string | null;
  createdAt: string;
  _count: {
    expenses: number;
    participants: number;
  };
}

export default function MyTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/trips');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch trips');
      }

      setTrips(result.trips);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען טיולים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">הטיולים שלי</h1>
            <p className="text-gray-600">כל הטיולים שנשמרו ב-Database</p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-gray-700 font-medium"
          >
            ← חזרה לדף הראשי
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && trips.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">✈️</div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              אין טיולים עדיין
            </h2>
            <p className="text-gray-500 mb-6">
              צור את הטיול הראשון שלך!
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              חזרה לדף הראשי
            </Link>
          </div>
        )}

        {/* Trips Grid */}
        {trips.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{trip.name}</h3>
                  <span className="text-2xl">{getCurrencyFlag(trip.baseCurrency)}</span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{formatDate(trip.startDate)}</span>
                    {trip.endDate && (
                      <>
                        <span>→</span>
                        <span>{formatDate(trip.endDate)}</span>
                      </>
                    )}
                  </div>

                  {trip.travelStyle && (
                    <div className="flex items-center gap-2">
                      <span>🎒</span>
                      <span className="capitalize">{trip.travelStyle}</span>
                    </div>
                  )}

                  {trip.description && (
                    <p className="text-gray-500 mt-2 line-clamp-2">
                      {trip.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>💰</span>
                    <span>{trip._count.expenses} הוצאות</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <span>👥</span>
                    <span>{trip._count.participants} משתתפים</span>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-400">
                  נוצר: {formatDate(trip.createdAt)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Refresh Button */}
        {trips.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={fetchTrips}
              className="px-6 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-gray-700 font-medium"
            >
              🔄 רענן רשימה
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function getCurrencyFlag(currency: string): string {
  const flags: Record<string, string> = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    ILS: '🇮🇱',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    THB: '🇹🇭',
  };
  return flags[currency] || '💱';
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

