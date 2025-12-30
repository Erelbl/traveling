// Currency types - supporting many currencies
export type Currency = 
  | "ILS" // Israeli Shekel
  | "USD" // US Dollar
  | "EUR" // Euro
  | "GBP" // British Pound
  | "JPY" // Japanese Yen
  | "CNY" // Chinese Yuan
  | "THB" // Thai Baht
  | "AUD" // Australian Dollar
  | "CAD" // Canadian Dollar
  | "CHF" // Swiss Franc
  | "INR" // Indian Rupee
  | "AED" // UAE Dirham
  | "TRY" // Turkish Lira
  | "MXN" // Mexican Peso
  | "BRL" // Brazilian Real
  | "ZAR" // South African Rand
  | "SGD" // Singapore Dollar
  | "NZD" // New Zealand Dollar
  | "HKD" // Hong Kong Dollar
  | "SEK" // Swedish Krona
  | "NOK" // Norwegian Krone
  | "DKK" // Danish Krone
  | "PLN" // Polish Zloty
  | "CZK" // Czech Koruna
  | "HUF" // Hungarian Forint
  | "RON" // Romanian Leu
  | "RUB" // Russian Ruble
  | "KRW" // South Korean Won
  | "IDR" // Indonesian Rupiah
  | "MYR" // Malaysian Ringgit
  | "PHP" // Philippine Peso
  | "VND" // Vietnamese Dong
  | "EGP" // Egyptian Pound
  | "SAR" // Saudi Riyal
  | "QAR" // Qatari Riyal
  | "KWD" // Kuwaiti Dinar
  | "JOD" // Jordanian Dinar
  | "ARS" // Argentine Peso
  | "CLP" // Chilean Peso
  | "COP" // Colombian Peso
  | "PEN"; // Peruvian Sol

// Expense categories - internal values in English
export type ExpenseCategory =
  | "flights"
  | "accommodation"
  | "food"
  | "transportation"
  | "attractions"
  | "insurance"
  | "shopping"
  | "miscellaneous";

// Hebrew labels for categories
export const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  flights: "טיסות",
  accommodation: "לינה",
  food: "אוכל",
  transportation: "נסיעות",
  attractions: "אטרקציות",
  insurance: "ביטוח",
  shopping: "קניות",
  miscellaneous: "שונות",
};

// Expense interface
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

// Country interface
export interface Country {
  code: string;
  name: string;
  flag: string;
  currency: Currency;
}

// Common countries with their currencies
export const COUNTRIES: Country[] = [
  { code: "IL", name: "ישראל", flag: "🇮🇱", currency: "ILS" },
  { code: "US", name: "ארה״ב", flag: "🇺🇸", currency: "USD" },
  { code: "GB", name: "בריטניה", flag: "🇬🇧", currency: "GBP" },
  { code: "EU", name: "אירופה", flag: "🇪🇺", currency: "EUR" },
  { code: "TH", name: "תאילנד", flag: "🇹🇭", currency: "THB" },
  { code: "JP", name: "יפן", flag: "🇯🇵", currency: "JPY" },
  { code: "CN", name: "סין", flag: "🇨🇳", currency: "CNY" },
  { code: "AU", name: "אוסטרליה", flag: "🇦🇺", currency: "AUD" },
  { code: "CA", name: "קנדה", flag: "🇨🇦", currency: "CAD" },
  { code: "CH", name: "שווייץ", flag: "🇨🇭", currency: "CHF" },
  { code: "IN", name: "הודו", flag: "🇮🇳", currency: "INR" },
  { code: "AE", name: "איחוד האמירויות", flag: "🇦🇪", currency: "AED" },
  { code: "TR", name: "טורקיה", flag: "🇹🇷", currency: "TRY" },
  { code: "MX", name: "מקסיקו", flag: "🇲🇽", currency: "MXN" },
  { code: "BR", name: "ברזיל", flag: "🇧🇷", currency: "BRL" },
  { code: "ZA", name: "דרום אפריקה", flag: "🇿🇦", currency: "ZAR" },
  { code: "SG", name: "סינגפור", flag: "🇸🇬", currency: "SGD" },
  { code: "NZ", name: "ניו זילנד", flag: "🇳🇿", currency: "NZD" },
  { code: "HK", name: "הונג קונג", flag: "🇭🇰", currency: "HKD" },
  { code: "SE", name: "שבדיה", flag: "🇸🇪", currency: "SEK" },
  { code: "NO", name: "נורווגיה", flag: "🇳🇴", currency: "NOK" },
  { code: "DK", name: "דנמרק", flag: "🇩🇰", currency: "DKK" },
  { code: "PL", name: "פולין", flag: "🇵🇱", currency: "PLN" },
  { code: "CZ", name: "צ׳כיה", flag: "🇨🇿", currency: "CZK" },
  { code: "KR", name: "דרום קוריאה", flag: "🇰🇷", currency: "KRW" },
  { code: "ID", name: "אינדונזיה", flag: "🇮🇩", currency: "IDR" },
  { code: "MY", name: "מלזיה", flag: "🇲🇾", currency: "MYR" },
  { code: "PH", name: "פיליפינים", flag: "🇵🇭", currency: "PHP" },
  { code: "VN", name: "וייטנאם", flag: "🇻🇳", currency: "VND" },
  { code: "EG", name: "מצרים", flag: "🇪🇬", currency: "EGP" },
  { code: "SA", name: "ערב הסעודית", flag: "🇸🇦", currency: "SAR" },
  { code: "AR", name: "ארגנטינה", flag: "🇦🇷", currency: "ARS" },
  { code: "CL", name: "צ׳ילה", flag: "🇨🇱", currency: "CLP" },
];

// All supported categories
export const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  "flights",
  "accommodation",
  "food",
  "transportation",
  "attractions",
  "insurance",
  "shopping",
  "miscellaneous",
];

// Currency metadata
export interface CurrencyMeta {
  symbol: string;
  flag: string;
  label: string;
}

// Get currency metadata
export const getCurrencyMeta = (currency: Currency): CurrencyMeta => {
  const meta: Record<Currency, CurrencyMeta> = {
    ILS: { symbol: "₪", flag: "🇮🇱", label: "שקל" },
    USD: { symbol: "$", flag: "🇺🇸", label: "דולר" },
    EUR: { symbol: "€", flag: "🇪🇺", label: "יורו" },
    GBP: { symbol: "£", flag: "🇬🇧", label: "פאונד" },
    JPY: { symbol: "¥", flag: "🇯🇵", label: "ין" },
    CNY: { symbol: "¥", flag: "🇨🇳", label: "יואן" },
    THB: { symbol: "฿", flag: "🇹🇭", label: "באט" },
    AUD: { symbol: "A$", flag: "🇦🇺", label: "דולר אוסטרלי" },
    CAD: { symbol: "C$", flag: "🇨🇦", label: "דולר קנדי" },
    CHF: { symbol: "Fr", flag: "🇨🇭", label: "פרנק שוויצרי" },
    INR: { symbol: "₹", flag: "🇮🇳", label: "רופי" },
    AED: { symbol: "د.إ", flag: "🇦🇪", label: "דירהם" },
    TRY: { symbol: "₺", flag: "🇹🇷", label: "לירה טורקית" },
    MXN: { symbol: "$", flag: "🇲🇽", label: "פסו מקסיקני" },
    BRL: { symbol: "R$", flag: "🇧🇷", label: "ריאל ברזילאי" },
    ZAR: { symbol: "R", flag: "🇿🇦", label: "ראנד" },
    SGD: { symbol: "S$", flag: "🇸🇬", label: "דולר סינגפורי" },
    NZD: { symbol: "NZ$", flag: "🇳🇿", label: "דולר ניו זילנדי" },
    HKD: { symbol: "HK$", flag: "🇭🇰", label: "דולר הונג קונג" },
    SEK: { symbol: "kr", flag: "🇸🇪", label: "כתר שבדי" },
    NOK: { symbol: "kr", flag: "🇳🇴", label: "כתר נורווגי" },
    DKK: { symbol: "kr", flag: "🇩🇰", label: "כתר דני" },
    PLN: { symbol: "zł", flag: "🇵🇱", label: "זלוטי" },
    CZK: { symbol: "Kč", flag: "🇨🇿", label: "כתר צ׳כי" },
    HUF: { symbol: "Ft", flag: "🇭🇺", label: "פורינט" },
    RON: { symbol: "lei", flag: "🇷🇴", label: "לאו רומני" },
    RUB: { symbol: "₽", flag: "🇷🇺", label: "רובל" },
    KRW: { symbol: "₩", flag: "🇰🇷", label: "וון" },
    IDR: { symbol: "Rp", flag: "🇮🇩", label: "רופיה" },
    MYR: { symbol: "RM", flag: "🇲🇾", label: "רינגיט" },
    PHP: { symbol: "₱", flag: "🇵🇭", label: "פסו פיליפיני" },
    VND: { symbol: "₫", flag: "🇻🇳", label: "דונג" },
    EGP: { symbol: "E£", flag: "🇪🇬", label: "לירה מצרית" },
    SAR: { symbol: "﷼", flag: "🇸🇦", label: "ריאל סעודי" },
    QAR: { symbol: "﷼", flag: "🇶🇦", label: "ריאל קטארי" },
    KWD: { symbol: "د.ك", flag: "🇰🇼", label: "דינר כוויתי" },
    JOD: { symbol: "د.ا", flag: "🇯🇴", label: "דינר ירדני" },
    ARS: { symbol: "$", flag: "🇦🇷", label: "פסו ארגנטינאי" },
    CLP: { symbol: "$", flag: "🇨🇱", label: "פסו צ׳יליאני" },
    COP: { symbol: "$", flag: "🇨🇴", label: "פסו קולומביאני" },
    PEN: { symbol: "S/", flag: "🇵🇪", label: "סול פרואני" },
  };
  return meta[currency];
};

// Format amount with locale-specific formatting
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};
