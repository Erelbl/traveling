'use client';

import { useState } from 'react';

interface Participant {
  id: string;
  name: string;
  email: string | null;
}

interface Expense {
  id: string;
  amount: number;
  currency: string;
  category: string;
  description: string;
  notes: string | null;
  date: Date;
  paidBy: Participant;
}

interface Trip {
  id: string;
  name: string;
  baseCurrency: string;
}

interface TripExpensesProps {
  trip: Trip;
  initialExpenses: Expense[];
}

const CATEGORIES = [
  { value: 'flights', label: '✈️ טיסות', color: 'from-blue-500 to-cyan-500' },
  { value: 'accommodation', label: '🏨 לינה', color: 'from-purple-500 to-pink-500' },
  { value: 'food', label: '🍽️ אוכל', color: 'from-orange-500 to-red-500' },
  { value: 'transportation', label: '🚗 תחבורה', color: 'from-green-500 to-teal-500' },
  { value: 'attractions', label: '🎭 אטרקציות', color: 'from-yellow-500 to-orange-500' },
  { value: 'insurance', label: '🛡️ ביטוח', color: 'from-gray-500 to-slate-500' },
  { value: 'shopping', label: '🛍️ קניות', color: 'from-pink-500 to-rose-500' },
  { value: 'miscellaneous', label: '📦 אחר', color: 'from-indigo-500 to-blue-500' },
];

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

function formatCurrency(amount: number, currency: string): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString('he-IL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getCategoryInfo(category: string) {
  return CATEGORIES.find((c) => c.value === category) || CATEGORIES[CATEGORIES.length - 1];
}

export default function TripExpenses({ trip, initialExpenses }: TripExpensesProps) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [isAddingExpense, setIsAddingExpense] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      tripId: trip.id,
      amount: parseFloat(formData.get('amount') as string),
      currency: formData.get('currency') as string,
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      notes: formData.get('notes') as string,
      date: formData.get('date') as string,
    };

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create expense');
      }

      // Add new expense to the list
      setExpenses([result.expense, ...expenses]);
      setIsAddingExpense(false);
      
      // Reset form
      (e.target as HTMLFormElement).reset();

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create expense');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>💰</span>
            הוצאות
          </h2>
          <p className="text-gray-600 mt-1">
            סה"כ: {formatCurrency(totalExpenses, trip.baseCurrency)}
          </p>
        </div>
        {!isAddingExpense && (
          <button
            onClick={() => setIsAddingExpense(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            הוצאה חדשה
          </button>
        )}
      </div>

      {/* New Expense Form */}
      {isAddingExpense && (
        <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-cyan-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">הוצאה חדשה</h3>
            <button
              onClick={() => {
                setIsAddingExpense(false);
                setError(null);
              }}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  סכום *
                </label>
                <input
                  type="number"
                  name="amount"
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מטבע *
                </label>
                <select
                  name="currency"
                  defaultValue={trip.baseCurrency}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="USD">🇺🇸 USD</option>
                  <option value="EUR">🇪🇺 EUR</option>
                  <option value="ILS">🇮🇱 ILS</option>
                  <option value="GBP">🇬🇧 GBP</option>
                  <option value="JPY">🇯🇵 JPY</option>
                  <option value="THB">🇹🇭 THB</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                קטגוריה *
              </label>
              <select
                name="category"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תיאור *
              </label>
              <input
                type="text"
                name="description"
                required
                maxLength={200}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="למשל: ארוחת ערב במסעדה"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                הערות
              </label>
              <textarea
                name="notes"
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="הערות נוספות (אופציונלי)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                תאריך
              </label>
              <input
                type="date"
                name="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsAddingExpense(false);
                  setError(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                ביטול
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'שומר...' : 'שמור הוצאה'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses List */}
      {expenses.length > 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="space-y-3">
            {expenses.map((expense) => {
              const categoryInfo = getCategoryInfo(expense.category);
              return (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 bg-gradient-to-br ${categoryInfo.color} rounded-xl flex items-center justify-center text-white text-xl shadow-lg`}>
                      {categoryInfo.label.split(' ')[0]}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">
                        {expense.description}
                      </div>
                      <div className="text-sm text-gray-600">
                        {expense.paidBy.name} • {formatDate(expense.date)}
                      </div>
                      {expense.notes && (
                        <div className="text-sm text-gray-500 mt-1">
                          {expense.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xl font-bold text-gray-900">
                      {formatCurrency(Number(expense.amount), expense.currency)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {categoryInfo.label.split(' ').slice(1).join(' ')}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">💸</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            אין הוצאות עדיין
          </h3>
          <p className="text-gray-500 mb-6">
            התחל לתעד הוצאות כדי לעקוב אחרי התקציב
          </p>
          <button
            onClick={() => setIsAddingExpense(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            הוסף הוצאה ראשונה
          </button>
        </div>
      )}
    </div>
  );
}

