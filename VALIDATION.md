# Currency and Trip Validation System

## Overview

This document describes the validation system implemented to ensure that `baseCurrency` and other trip fields are always valid.

## Key Components

### 1. Currency Validation (`types/expense.ts`)

#### Constants
- `SUPPORTED_CURRENCIES`: Array of all supported currency codes (41 currencies)
- `DEFAULT_CURRENCY`: Default currency (`"USD"`) used when invalid currency is detected

#### Functions
- `isValidCurrency(value)`: Type guard to check if a value is a valid Currency
- `getValidCurrencyOrDefault(value)`: Returns the value if valid, otherwise returns DEFAULT_CURRENCY
- `getCurrencyMeta(currency)`: **Always returns a valid CurrencyMeta object** - never returns undefined

### 2. Trip Validation (`lib/validation.ts`)

#### Functions
- `validateTripData(data)`: Validates all trip fields and returns an array of validation errors
- `isValidTrip(data)`: Returns boolean indicating if trip data is valid
- `sanitizeTripData(data)`: **Sanitizes and fixes invalid trip data** - ensures baseCurrency is always valid

#### Validation Rules for baseCurrency
1. ✅ **Required**: Must not be null, undefined, or empty
2. ✅ **Type**: Must be a string
3. ✅ **Value**: Must be one of the 41 supported currencies
4. ✅ **Fallback**: If invalid, automatically replaced with "USD"

## Implementation Details

### Client-Side Validation

#### CreateTripForm Component
```typescript
// Uses validateTripData before creating trip
const validationErrors = validateTripData(tripData);
if (validationErrors.length > 0) {
  // Show error to user
  return;
}
```

**Key Features:**
- Form initializes with valid default currency ("ILS")
- Currency dropdown only shows supported currencies
- Validation prevents submission with invalid baseCurrency
- User-friendly Hebrew error messages

### Loading Existing Data

#### app/page.tsx
```typescript
// Sanitizes trip data when loading from localStorage
const sanitizedTrip = sanitizeTripData(rawTrip);
if (sanitizedTrip.baseCurrency !== rawTrip.baseCurrency) {
  // Data was fixed, save corrected version
  localStorage.setItem("current_trip", JSON.stringify(sanitizedTrip));
}
```

**Key Features:**
- Old trips with invalid baseCurrency are automatically fixed
- Fixed data is saved back to localStorage
- UI never crashes due to invalid currency data
- Console warning logged when invalid data is detected

### Server-Side Validation (Future)

An example API route is provided in `app/api/trips/route.ts.example` that demonstrates:
- Server-side validation using `validateTripData`
- Data sanitization before saving to database
- Proper error responses with validation details
- Protection against invalid data in requests

## Edge Cases Handled

### ✅ Handled Successfully
1. **Empty string currency**: Replaced with DEFAULT_CURRENCY
2. **null/undefined currency**: Replaced with DEFAULT_CURRENCY
3. **Invalid currency code**: Replaced with DEFAULT_CURRENCY
4. **Unknown currency code**: getCurrencyMeta returns fallback with 🏳️ flag
5. **Old data in localStorage**: Automatically sanitized on load
6. **Missing currency in form**: Validation prevents submission

### UI Behavior with Invalid Data

Thanks to the robust `getCurrencyMeta` function:
- Unknown currencies display: 🏳️ flag, currency code as symbol and label
- UI never crashes with "Cannot read property 'flag' of undefined"
- User sees clear indication when currency is unknown

## Testing Checklist

### ✅ Client-Side
- [x] Form validation prevents empty baseCurrency
- [x] Form validation prevents invalid baseCurrency
- [x] Form only allows selection from SUPPORTED_CURRENCIES
- [x] UI displays fallback for unknown currencies

### ✅ Data Loading
- [x] Old trips with invalid currency are sanitized
- [x] Sanitized data is saved back to storage
- [x] Invalid trip data is removed from localStorage
- [x] Console logs warning for invalid data

### 🔄 Server-Side (When API Routes Are Added)
- [ ] POST /api/trips validates baseCurrency
- [ ] Invalid requests return 400 with error details
- [ ] Database queries sanitize loaded data
- [ ] Migration script to fix existing database records

## Migration Guide (Future)

When transitioning to database storage:

1. **Add database validation constraint**
   ```prisma
   model Trip {
     baseCurrency String // Add @check constraint if supported
   }
   ```

2. **Create migration script**
   ```sql
   -- Fix any invalid baseCurrency in existing records
   UPDATE Trip 
   SET baseCurrency = 'USD' 
   WHERE baseCurrency NOT IN ('ILS', 'USD', 'EUR', ...);
   ```

3. **Update CreateTripForm**
   - Change from localStorage to fetch POST request
   - Handle server validation errors
   - Show user-friendly error messages

4. **Implement API routes**
   - Rename `route.ts.example` to `route.ts`
   - Add Prisma database calls
   - Ensure all endpoints sanitize input data

## Summary

The validation system ensures that:
1. ✅ **No invalid baseCurrency can be stored** (client-side validation)
2. ✅ **Existing invalid data is automatically fixed** (sanitization)
3. ✅ **UI never crashes** (robust getCurrencyMeta)
4. ✅ **Clear error messages** (user-friendly validation)
5. ✅ **Ready for server-side validation** (example API route provided)

All data flows through validation, making the system **robust and maintainable**.

