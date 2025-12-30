/**
 * Validation utilities for Trip and Expense data
 * Can be used both client-side and server-side
 */

import { Currency, isValidCurrency, SUPPORTED_CURRENCIES } from "@/types/expense";
import { Trip, TravelStyle } from "@/types/trip";

// Validation error response
export interface ValidationError {
  field: string;
  message: string;
}

// Validate trip data
export function validateTripData(data: Partial<Trip>): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push({ field: "name", message: "Trip name is required" });
  }

  // baseCurrency validation - CRITICAL: must be a valid currency
  if (!data.baseCurrency) {
    errors.push({ field: "baseCurrency", message: "Base currency is required" });
  } else if (!isValidCurrency(data.baseCurrency)) {
    errors.push({
      field: "baseCurrency",
      message: `Invalid currency. Must be one of: ${SUPPORTED_CURRENCIES.join(", ")}`,
    });
  }

  // Adults validation
  if (typeof data.adults !== "number" || data.adults < 1) {
    errors.push({ field: "adults", message: "At least 1 adult is required" });
  }

  // Children validation
  if (typeof data.children !== "number" || data.children < 0) {
    errors.push({ field: "children", message: "Children count must be 0 or more" });
  }

  // Travel style validation
  const validStyles: TravelStyle[] = ["honeymoon", "family", "post-army", "urban", "other"];
  if (!data.travelStyle || !validStyles.includes(data.travelStyle)) {
    errors.push({ field: "travelStyle", message: "Invalid travel style" });
  }

  // If travelStyle is "other", tripStyleOther must be provided
  if (data.travelStyle === "other" && (!data.tripStyleOther || !data.tripStyleOther.trim())) {
    errors.push({ field: "tripStyleOther", message: "Travel style description is required when 'other' is selected" });
  }

  return errors;
}

// Check if validation passed
export function isValidTrip(data: Partial<Trip>): boolean {
  return validateTripData(data).length === 0;
}

// Get first validation error message
export function getFirstError(errors: ValidationError[]): string | null {
  return errors.length > 0 ? errors[0].message : null;
}

// Sanitize trip data loaded from storage or API
// Ensures all required fields have valid values
export function sanitizeTripData(data: any): Trip | null {
  try {
    // Basic structure check
    if (!data || typeof data !== "object") {
      return null;
    }

    // Fix baseCurrency if invalid
    let baseCurrency: Currency = data.baseCurrency;
    if (!isValidCurrency(baseCurrency)) {
      console.warn(`Invalid baseCurrency '${baseCurrency}' found in trip data, defaulting to USD`);
      baseCurrency = "USD";
    }

    // Ensure adults is valid
    const adults = typeof data.adults === "number" && data.adults >= 1 ? data.adults : 2;
    
    // Ensure children is valid
    const children = typeof data.children === "number" && data.children >= 0 ? data.children : 0;

    // Return sanitized trip
    return {
      id: data.id || `trip_${Date.now()}`,
      name: data.name || "Untitled Trip",
      startDate: data.startDate || new Date().toISOString().split("T")[0],
      baseCurrency,
      adults,
      children,
      travelStyle: data.travelStyle || "other",
      tripStyleOther: data.tripStyleOther,
      createdAt: data.createdAt || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error sanitizing trip data:", error);
    return null;
  }
}

