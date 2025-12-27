'use client';

import { useState, useEffect, useMemo } from 'react';

type Currency = 'ILS' | 'USD' | 'EUR' | 'THB';
type Category = 'אוכל' | 'תחבורה' | 'לינה' | 'אטרקציות' | 'קניות' | 'אחר';

interface Country {
  code: string;
  name: string;
  currency: Currency;
  flag: string;
}

interface Expense {
  id: string;
  תיאור: string;
  סכום: number;
  מטבע: Currency;
  קטגוריה: Category;
  תאריך: string;
  מדינה: string; // קוד המדינה (TH, US, IL, EU)
}

interface CurrencyMeta {
  symbol: string;
  flag: string;
  code: Currency;
}

// מדינות ברירת מחדל
const defaultCountries: Country[] = [
  { code: 'TH', name: 'תאילנד', currency: 'THB', flag: '🇹🇭' },
  { code: 'IL', name: 'ישראל', currency: 'ILS', flag: '🇮🇱' },
  { code: 'US', name: 'ארה״ב', currency: 'USD', flag: '🇺🇸' },
  { code: 'EU', name: 'אירופה', currency: 'EUR', flag: '🇪🇺' },
];

// פונקציה לקבלת מדינה לפי קוד
const getCountryByCode = (code: string): Country | undefined => {
  return defaultCountries.find((c) => c.code === code);
};

// פונקציה לקבלת מדינה לפי מטבע (למיגרציה)
const getCountryByCurrency = (currency: Currency): Country => {
  const country = defaultCountries.find((c) => c.currency === currency);
  return country || defaultCountries[0]; // fallback
};

// פונקציות עזר
const getCurrencyMeta = (currency: Currency): CurrencyMeta => {
  const meta: Record<Currency, CurrencyMeta> = {
    THB: { symbol: '฿', flag: '🇹🇭', code: 'THB' },
    USD: { symbol: '$', flag: '🇺🇸', code: 'USD' },
    EUR: { symbol: '€', flag: '🇪🇺', code: 'EUR' },
    ILS: { symbol: '₪', flag: '🇮🇱', code: 'ILS' },
  };
  return meta[currency];
};

const formatAmount = (amount: number, currency: Currency): string => {
  const meta = getCurrencyMeta(currency);
  return `${meta.symbol} ${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// מיגרציה: הוספת מדינה להוצאות ישנות
const migrateExpenses = (expenses: any[]): Expense[] => {
  return expenses.map((exp) => {
    if (exp.מדינה) {
      return exp as Expense;
    }
    // אם אין מדינה, נקבע לפי מטבע
    const country = getCountryByCurrency(exp.מטבע);
    return {
      ...exp,
      מדינה: country.code,
    };
  });
};

const defaultExpenses: Expense[] = [
  {
    id: '1',
    תיאור: 'ארוחת ערב במסעדה',
    סכום: 150,
    מטבע: 'THB',
    קטגוריה: 'אוכל',
    תאריך: new Date().toISOString().split('T')[0],
    מדינה: 'TH',
  },
  {
    id: '2',
    תיאור: 'כרטיס טיסה',
    סכום: 500,
    מטבע: 'USD',
    קטגוריה: 'תחבורה',
    תאריך: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    מדינה: 'US',
  },
  {
    id: '3',
    תיאור: 'בית מלון',
    סכום: 800,
    מטבע: 'ILS',
    קטגוריה: 'לינה',
    תאריך: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    מדינה: 'IL',
  },
];

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    תיאור: '',
    סכום: 0,
    מטבע: 'THB',
    קטגוריה: 'אוכל',
    תאריך: new Date().toISOString().split('T')[0],
    מדינה: 'TH',
  });
  const [filterCategory, setFilterCategory] = useState<Category | 'הכול'>('הכול');
  const [filterCurrency, setFilterCurrency] = useState<Currency | 'הכול'>('הכול');
  const [filterCountry, setFilterCountry] = useState<string | 'הכול'>('הכול');

  // טעינה ראשונית מ-localStorage
  useEffect(() => {
    const saved = localStorage.getItem('travel_expenses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // מיגרציה: הוספת מדינה להוצאות ישנות
        const migrated = migrateExpenses(parsed);
        setExpenses(migrated);
        // שמירה מחדש עם המדינות
        localStorage.setItem('travel_expenses', JSON.stringify(migrated));
      } catch (error) {
        console.error('שגיאה בטעינת נתונים:', error);
        setExpenses(defaultExpenses);
        localStorage.setItem('travel_expenses', JSON.stringify(defaultExpenses));
      }
    } else {
      setExpenses(defaultExpenses);
      localStorage.setItem('travel_expenses', JSON.stringify(defaultExpenses));
    }
  }, []);

  // שמירה ב-localStorage בכל שינוי
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('travel_expenses', JSON.stringify(expenses));
    } else {
      localStorage.removeItem('travel_expenses');
    }
  }, [expenses]);

  // עדכון מטבע אוטומטי לפי מדינה
  useEffect(() => {
    const country = getCountryByCode(formData.מדינה);
    if (country) {
      setFormData((prev) => ({
        ...prev,
        מטבע: country.currency,
      }));
    }
  }, [formData.מדינה]);

  // חישוב סיכומים לפי מטבע
  const summaryByCurrency = useMemo(() => {
    const summary: Record<Currency, number> = {
      THB: 0,
      USD: 0,
      EUR: 0,
      ILS: 0,
    };

    expenses.forEach((exp) => {
      summary[exp.מטבע] += exp.סכום;
    });

    return Object.entries(summary)
      .filter(([_, amount]) => amount > 0)
      .map(([currency, amount]) => ({
        currency: currency as Currency,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  // חישוב סיכומים לפי קטגוריה
  const summaryByCategory = useMemo(() => {
    const summary: Record<Category, Record<Currency, number>> = {
      אוכל: { THB: 0, USD: 0, EUR: 0, ILS: 0 },
      תחבורה: { THB: 0, USD: 0, EUR: 0, ILS: 0 },
      לינה: { THB: 0, USD: 0, EUR: 0, ILS: 0 },
      אטרקציות: { THB: 0, USD: 0, EUR: 0, ILS: 0 },
      קניות: { THB: 0, USD: 0, EUR: 0, ILS: 0 },
      אחר: { THB: 0, USD: 0, EUR: 0, ILS: 0 },
    };

    expenses.forEach((exp) => {
      summary[exp.קטגוריה][exp.מטבע] += exp.סכום;
    });

    return Object.entries(summary)
      .filter(([_, amounts]) => Object.values(amounts).some((amt) => amt > 0))
      .map(([category, amounts]) => ({
        category: category as Category,
        amounts: Object.entries(amounts)
          .filter(([_, amount]) => amount > 0)
          .map(([currency, amount]) => ({
            currency: currency as Currency,
            amount,
          })),
      }));
  }, [expenses]);

  // חישוב סיכומים לפי מדינה
  const summaryByCountry = useMemo(() => {
    const summary: Record<string, Record<Currency, number>> = {};

    expenses.forEach((exp) => {
      if (!summary[exp.מדינה]) {
        summary[exp.מדינה] = { THB: 0, USD: 0, EUR: 0, ILS: 0 };
      }
      summary[exp.מדינה][exp.מטבע] += exp.סכום;
    });

    return Object.entries(summary)
      .map(([countryCode, amounts]) => {
        const country = getCountryByCode(countryCode);
        return {
          countryCode,
          countryName: country?.name || countryCode,
          countryFlag: country?.flag || '🏳️',
          amounts: Object.entries(amounts)
            .filter(([_, amount]) => amount > 0)
            .map(([currency, amount]) => ({
              currency: currency as Currency,
              amount,
            })),
        };
      })
      .filter((item) => item.amounts.length > 0)
      .sort((a, b) => {
        const aTotal = a.amounts.reduce((sum, item) => sum + item.amount, 0);
        const bTotal = b.amounts.reduce((sum, item) => sum + item.amount, 0);
        return bTotal - aTotal;
      });
  }, [expenses]);

  // פילטור הוצאות
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchCategory = filterCategory === 'הכול' || exp.קטגוריה === filterCategory;
      const matchCurrency = filterCurrency === 'הכול' || exp.מטבע === filterCurrency;
      const matchCountry = filterCountry === 'הכול' || exp.מדינה === filterCountry;
      return matchCategory && matchCurrency && matchCountry;
    });
  }, [expenses, filterCategory, filterCurrency, filterCountry]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'סכום' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ולידציה
    if (!formData.תיאור.trim()) {
      alert('אנא הזן תיאור');
      return;
    }

    if (formData.סכום <= 0) {
      alert('הסכום חייב להיות גדול מ-0');
      return;
    }

    if (!formData.מדינה) {
      alert('אנא בחר מדינה');
      return;
    }

    // יצירת הוצאה חדשה
    const newExpense: Expense = {
      id: Date.now().toString(),
      ...formData,
    };

    setExpenses((prev) => [newExpense, ...prev]);

    // איפוס הטופס (חוץ ממטבע, קטגוריה ומדינה)
    const country = getCountryByCode(formData.מדינה);
    setFormData({
      תיאור: '',
      סכום: 0,
      מטבע: country?.currency || 'THB',
      קטגוריה: 'אוכל',
      תאריך: new Date().toISOString().split('T')[0],
      מדינה: formData.מדינה,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את ההוצאה?')) {
      setExpenses((prev) => prev.filter((exp) => exp.id !== id));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל ההוצאות? פעולה זו לא ניתנת לביטול.')) {
      setExpenses([]);
    }
  };

  const categories: Category[] = ['אוכל', 'תחבורה', 'לינה', 'אטרקציות', 'קניות', 'אחר'];
  const currencies: Currency[] = ['THB', 'USD', 'EUR', 'ILS'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto max-w-7xl px-4 py-8 md:px-8">
        {/* כותרת */}
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-5xl font-bold text-gray-900 dark:text-white md:text-6xl">
            ניהול הוצאות טיול
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            נהל את ההוצאות שלך בצורה פשוטה ויעילה
          </p>
        </div>

        {/* כרטיסי סיכומים */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          {/* סיכום לפי מטבע */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              סה״כ לפי מטבע
            </h2>
            {summaryByCurrency.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">אין הוצאות</p>
            ) : (
              <div className="space-y-3">
                {summaryByCurrency.map(({ currency, amount }) => {
                  const meta = getCurrencyMeta(currency);
                  return (
                    <div
                      key={currency}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                    >
                      <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {meta.flag} {currency}
                      </span>
                      <span className="text-lg font-bold text-gray-900 dark:text-white" dir="ltr">
                        {formatAmount(amount, currency)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* סיכום לפי קטגוריה */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              סה״כ לפי קטגוריה
            </h2>
            {summaryByCategory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">אין הוצאות</p>
            ) : (
              <div className="space-y-3">
                {summaryByCategory.map(({ category, amounts }) => (
                  <div
                    key={category}
                    className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                  >
                    <div className="mb-2 font-semibold text-gray-900 dark:text-white">
                      {category}:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {amounts.map(({ currency, amount }) => {
                        const meta = getCurrencyMeta(currency);
                        return (
                          <span
                            key={currency}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            dir="ltr"
                          >
                            {meta.flag} {formatAmount(amount, currency)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* סיכום לפי מדינה */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
              סיכום לפי מדינה
            </h2>
            {summaryByCountry.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">אין הוצאות</p>
            ) : (
              <div className="space-y-3">
                {summaryByCountry.map(({ countryCode, countryName, countryFlag, amounts }) => (
                  <div
                    key={countryCode}
                    className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700"
                  >
                    <div className="mb-2 font-semibold text-gray-900 dark:text-white">
                      {countryFlag} {countryName}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {amounts.map(({ currency, amount }) => {
                        const meta = getCurrencyMeta(currency);
                        return (
                          <span
                            key={currency}
                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                            dir="ltr"
                          >
                            {meta.flag} {formatAmount(amount, currency)}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* טופס הוספת הוצאה */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-6 text-2xl font-bold text-gray-900 dark:text-white">
              הוספת הוצאה
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* תיאור */}
              <div>
                <label
                  htmlFor="תיאור"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  תיאור *
                </label>
                <input
                  type="text"
                  id="תיאור"
                  name="תיאור"
                  value={formData.תיאור}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="הזן תיאור ההוצאה"
                  required
                />
              </div>

              {/* מדינה */}
              <div>
                <label
                  htmlFor="מדינה"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  מדינה *
                </label>
                <select
                  id="מדינה"
                  name="מדינה"
                  value={formData.מדינה}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                >
                  {defaultCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* סכום ומטבע */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="סכום"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    סכום *
                  </label>
                  <input
                    type="number"
                    id="סכום"
                    name="סכום"
                    value={formData.סכום || ''}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-left text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="מטבע"
                    className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    מטבע
                  </label>
                  <select
                    id="מטבע"
                    name="מטבע"
                    value={formData.מטבע}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    {currencies.map((currency) => {
                      const meta = getCurrencyMeta(currency);
                      return (
                        <option key={currency} value={currency}>
                          {meta.flag} {currency} ({meta.symbol})
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* קטגוריה */}
              <div>
                <label
                  htmlFor="קטגוריה"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  קטגוריה
                </label>
                <select
                  id="קטגוריה"
                  name="קטגוריה"
                  value={formData.קטגוריה}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* תאריך */}
              <div>
                <label
                  htmlFor="תאריך"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  תאריך
                </label>
                <input
                  type="date"
                  id="תאריך"
                  name="תאריך"
                  value={formData.תאריך}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              {/* כפתור הוסף */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-blue-700 hover:to-indigo-700 active:scale-95"
              >
                הוסף
              </button>
            </form>
          </div>

          {/* רשימת הוצאות */}
          <div className="rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                רשימת הוצאות
              </h2>
              {expenses.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  נקה את כל ההוצאות
                </button>
              )}
            </div>

            {/* פילטרים */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div>
                <label
                  htmlFor="filter-category"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  פילטר קטגוריה
                </label>
                <select
                  id="filter-category"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as Category | 'הכול')}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="הכול">הכול</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="filter-currency"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  פילטר מטבע
                </label>
                <select
                  id="filter-currency"
                  value={filterCurrency}
                  onChange={(e) => setFilterCurrency(e.target.value as Currency | 'הכול')}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="הכול">הכול</option>
                  {currencies.map((currency) => {
                    const meta = getCurrencyMeta(currency);
                    return (
                      <option key={currency} value={currency}>
                        {meta.flag} {currency}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label
                  htmlFor="filter-country"
                  className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  פילטר מדינה
                </label>
                <select
                  id="filter-country"
                  value={filterCountry}
                  onChange={(e) => setFilterCountry(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-right text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="הכול">הכול</option>
                  {defaultCountries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredExpenses.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">
                {expenses.length === 0
                  ? 'אין הוצאות עדיין'
                  : 'אין הוצאות התואמות לפילטרים'}
              </p>
            ) : (
              <div className="space-y-4">
                {filteredExpenses.map((expense) => {
                  const meta = getCurrencyMeta(expense.מטבע);
                  const country = getCountryByCode(expense.מדינה);
                  return (
                    <div
                      key={expense.id}
                      className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-700"
                    >
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {expense.תיאור}
                          </span>
                          <span
                            className="text-left font-bold text-gray-900 dark:text-white"
                            dir="ltr"
                          >
                            {formatAmount(expense.סכום, expense.מטבע)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{expense.קטגוריה}</span>
                          <span>•</span>
                          {country && (
                            <>
                              <span>
                                {country.flag} {country.name}
                              </span>
                              <span>•</span>
                            </>
                          )}
                          <span>
                            {meta.flag} {expense.מטבע}
                          </span>
                          <span>•</span>
                          <span>{expense.תאריך}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="mr-4 rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="מחק"
                      >
                        מחק
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
