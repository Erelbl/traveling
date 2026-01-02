interface CategorySpend {
  category: string;
  total: number;
  count: number;
}

interface TripSummaryProps {
  baseCurrency: string;
  totalSpend: number;
  spendByCategory: CategorySpend[];
  last7DaysTotal: number;
}

const CATEGORY_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  flights: { label: 'טיסות', emoji: '✈️', color: 'bg-blue-500' },
  accommodation: { label: 'לינה', emoji: '🏨', color: 'bg-purple-500' },
  food: { label: 'אוכל', emoji: '🍽️', color: 'bg-orange-500' },
  transportation: { label: 'תחבורה', emoji: '🚗', color: 'bg-green-500' },
  attractions: { label: 'אטרקציות', emoji: '🎭', color: 'bg-yellow-500' },
  insurance: { label: 'ביטוח', emoji: '🛡️', color: 'bg-gray-500' },
  shopping: { label: 'קניות', emoji: '🛍️', color: 'bg-pink-500' },
  miscellaneous: { label: 'אחר', emoji: '📦', color: 'bg-indigo-500' },
};

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

export default function TripSummary({ 
  baseCurrency, 
  totalSpend, 
  spendByCategory, 
  last7DaysTotal 
}: TripSummaryProps) {
  // Calculate percentages for categories
  const categoriesWithPercent = spendByCategory.map((cat) => ({
    ...cat,
    percentage: totalSpend > 0 ? (cat.total / totalSpend) * 100 : 0,
  }));

  // Sort by total descending
  const sortedCategories = [...categoriesWithPercent].sort((a, b) => b.total - a.total);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Total Spend Card */}
      <div className="bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative">
          <div className="text-cyan-100 text-sm mb-2 font-medium">סה"כ הוצאות</div>
          <div className="text-4xl font-bold mb-1">
            {formatCurrency(totalSpend, baseCurrency)}
          </div>
          <div className="text-cyan-100 text-sm">
            {spendByCategory.reduce((sum, cat) => sum + cat.count, 0)} הוצאות
          </div>
        </div>
      </div>

      {/* Last 7 Days Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-gray-600 text-sm mb-2 font-medium">7 ימים אחרונים</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(last7DaysTotal, baseCurrency)}
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">📅</span>
          </div>
        </div>
        {totalSpend > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">אחוז מסה"כ</span>
              <span className="font-semibold text-blue-600">
                {((last7DaysTotal / totalSpend) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Average Per Day Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-purple-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-gray-600 text-sm mb-2 font-medium">ממוצע ליום</div>
            <div className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                last7DaysTotal > 0 ? last7DaysTotal / 7 : totalSpend / Math.max(1, spendByCategory.reduce((sum, cat) => sum + cat.count, 0)),
                baseCurrency
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {last7DaysTotal > 0 ? 'מבוסס על 7 ימים אחרונים' : 'הערכה כללית'}
          </div>
        </div>
      </div>

      {/* Spend by Category Card - Full Width */}
      {sortedCategories.length > 0 && (
        <div className="lg:col-span-3 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📊</span>
            הוצאות לפי קטגוריה
          </h3>
          <div className="space-y-3">
            {sortedCategories.map((category) => {
              const info = CATEGORY_INFO[category.category] || {
                label: category.category,
                emoji: '📦',
                color: 'bg-gray-500',
              };
              
              return (
                <div key={category.category} className="flex items-center gap-4">
                  {/* Category Icon */}
                  <div className={`w-10 h-10 ${info.color} rounded-lg flex items-center justify-center text-white text-xl shrink-0`}>
                    {info.emoji}
                  </div>

                  {/* Category Name */}
                  <div className="w-28 shrink-0">
                    <div className="font-semibold text-gray-900">{info.label}</div>
                    <div className="text-xs text-gray-500">{category.count} הוצאות</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full ${info.color} rounded-full transition-all duration-500`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium text-gray-600 w-12 text-right">
                        {category.percentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right w-32 shrink-0">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(category.total, baseCurrency)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Footer */}
          {sortedCategories.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between text-sm">
                <div className="text-gray-600">
                  הקטגוריה היקרה ביותר: <span className="font-semibold text-gray-900">
                    {CATEGORY_INFO[sortedCategories[0].category]?.label || sortedCategories[0].category}
                  </span>
                </div>
                <div className="text-gray-600">
                  {sortedCategories.length} קטגוריות פעילות
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

