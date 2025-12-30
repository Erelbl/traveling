export type Currency = "ILS" | "USD" | "EUR" | "THB";

export type ExpenseCategory =
  | "טיסות"
  | "נסיעות"
  | "ביטוח"
  | "אטרקציות"
  | "אוכל"
  | "לינה"
  | "שונות";

export interface Expense {
  id: string;
  tripId: string;
  amount: number;
  currency: Currency;
  category: ExpenseCategory;
  countryCode: string;
  description?: string;
  date?: string;
  isPlanned: boolean;
  createdAt: string;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: Currency;
}

export const COUNTRIES: Country[] = [
  { code: "TH", name: "תאילנד", flag: "🇹🇭", currency: "THB" },
  { code: "IL", name: "ישראל", flag: "🇮🇱", currency: "ILS" },
  { code: "US", name: "ארה״ב", flag: "🇺🇸", currency: "USD" },
  { code: "EU", name: "אירופה", flag: "🇪🇺", currency: "EUR" },
];

export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "טיסות",
  "לינה",
  "אוכל",
  "נסיעות",
  "אטרקציות",
  "ביטוח",
  "שונות",
];

export interface CurrencyMeta {
  symbol: string;
  flag: string;
  label: string;
}

export const getCurrencyMeta = (currency: Currency): CurrencyMeta => {
  const meta: Record<Currency, CurrencyMeta> = {
    ILS: { symbol: "₪", flag: "🇮🇱", label: "שקל" },
    USD: { symbol: "$", flag: "🇺🇸", label: "דולר" },
    EUR: { symbol: "€", flag: "🇪🇺", label: "יורו" },
    THB: { symbol: "฿", flag: "🇹🇭", label: "באט" },
  };
  return meta[currency];
};

export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

