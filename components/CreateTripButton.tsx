'use client';

import { useState } from 'react';

interface CreateTripButtonProps {
  onTripCreated?: () => void;
}

export default function CreateTripButton({ onTripCreated }: CreateTripButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const endDate = formData.get('endDate') as string;
    const data = {
      name: formData.get('name') as string,
      baseCurrency: formData.get('baseCurrency') as string,
      startDate: formData.get('startDate') as string,
      endDate: endDate || undefined, // Make it optional
      travelStyle: formData.get('travelStyle') as string,
      description: formData.get('description') as string,
    };

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create trip');
      }

      setSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
        onTripCreated?.();
      }, 1500);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-4 rounded-full font-semibold shadow-2xl hover:shadow-3xl hover:scale-105 transition-all z-40"
      >
        + יצירת טיול חדש ב-Database
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">טיול חדש</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✓ הטיול נוצר בהצלחה!
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם הטיול *
            </label>
            <input
              type="text"
              name="name"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="טיול ליפן"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              מטבע בסיס *
            </label>
            <select
              name="baseCurrency"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="USD">🇺🇸 USD - דולר</option>
              <option value="EUR">🇪🇺 EUR - יורו</option>
              <option value="ILS">🇮🇱 ILS - שקל</option>
              <option value="GBP">🇬🇧 GBP - פאונד</option>
              <option value="JPY">🇯🇵 JPY - ין</option>
              <option value="THB">🇹🇭 THB - באט</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תאריך התחלה
            </label>
            <input
              type="date"
              name="startDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תאריך סיום
            </label>
            <input
              type="date"
              name="endDate"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סגנון טיול
            </label>
            <select
              name="travelStyle"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            >
              <option value="">בחר סגנון</option>
              <option value="budget">תקציב נמוך</option>
              <option value="moderate">בינוני</option>
              <option value="luxury">יוקרתי</option>
              <option value="backpacking">תרמילאות</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              תיאור
            </label>
            <textarea
              name="description"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              placeholder="תיאור קצר של הטיול..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'שומר...' : 'צור טיול'}
            </button>
          </div>
        </form>

        <p className="mt-4 text-xs text-gray-500 text-center">
          💡 הטיול יישמר ב-Neon Database
        </p>
      </div>
    </div>
  );
}

