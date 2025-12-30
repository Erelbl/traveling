"use client";

import { useState, FormEvent, useMemo } from "react";
import { Trip, TravelStyle, TRAVEL_STYLE_LABELS } from "@/types/trip";
import { Currency, getCurrencyMeta } from "@/types/expense";

// All supported currencies
const ALL_CURRENCIES: Currency[] = [
  "ILS", "USD", "EUR", "GBP", "JPY", "CNY", "THB", "AUD", "CAD", "CHF",
  "INR", "AED", "TRY", "MXN", "BRL", "ZAR", "SGD", "NZD", "HKD", "SEK",
  "NOK", "DKK", "PLN", "CZK", "HUF", "RON", "RUB", "KRW", "IDR", "MYR",
  "PHP", "VND", "EGP", "SAR", "QAR", "KWD", "JOD", "ARS", "CLP", "COP", "PEN"
];

interface CreateTripFormProps {
  onTripCreated: (trip: Trip) => void;
}

export default function CreateTripForm({ onTripCreated }: CreateTripFormProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [baseCurrency, setBaseCurrency] = useState<Currency>("ILS");
  const [currencySearch, setCurrencySearch] = useState("");
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("other");
  const [tripStyleOther, setTripStyleOther] = useState("");

  // Filter currencies based on search
  const filteredCurrencies = useMemo(() => {
    if (!currencySearch) return ALL_CURRENCIES;
    const search = currencySearch.toLowerCase();
    return ALL_CURRENCIES.filter((curr) => {
      const meta = getCurrencyMeta(curr);
      return (
        curr.toLowerCase().includes(search) ||
        meta.label.includes(search) ||
        meta.symbol.includes(search)
      );
    });
  }, [currencySearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      alert("אנא הזן שם טיול");
      return;
    }

    if (adults < 1) {
      alert("חייב להיות לפחות מבוגר אחד");
      return;
    }

    if (travelStyle === "other" && !tripStyleOther.trim()) {
      alert("אנא הזן תיאור לסגנון הטיול");
      return;
    }

    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      name,
      startDate,
      baseCurrency,
      adults,
      children,
      travelStyle,
      tripStyleOther: travelStyle === "other" ? tripStyleOther : undefined,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("current_trip", JSON.stringify(newTrip));
    
    onTripCreated(newTrip);
  };

  const selectedCurrencyMeta = getCurrencyMeta(baseCurrency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl">
            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            נתחיל בטיול חדש
          </h1>
          <p className="text-gray-600 text-lg">
            כמה פרטים קטנים ואנחנו מתחילים
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Trip Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              שם הטיול
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="למשל: טיול לתאילנד"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">
              תאריך התחלה
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
            />
          </div>

          {/* Base Currency */}
          <div>
            <label htmlFor="baseCurrency" className="block text-gray-700 font-semibold mb-2">
              מטבע בסיס
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  <span className="text-2xl">{selectedCurrencyMeta.flag}</span>
                  <span className="font-bold">{baseCurrency}</span>
                  <span className="text-gray-600">{selectedCurrencyMeta.symbol}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-600">{selectedCurrencyMeta.label}</span>
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showCurrencyDropdown && (
                <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-96 overflow-hidden">
                  <div className="p-3 border-b border-gray-200">
                    <input
                      type="text"
                      placeholder="חפש מטבע..."
                      value={currencySearch}
                      onChange={(e) => setCurrencySearch(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="overflow-y-auto max-h-80">
                    {filteredCurrencies.map((curr) => {
                      const meta = getCurrencyMeta(curr);
                      return (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => {
                            setBaseCurrency(curr);
                            setShowCurrencyDropdown(false);
                            setCurrencySearch("");
                          }}
                          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors text-right ${
                            baseCurrency === curr ? "bg-blue-100" : ""
                          }`}
                        >
                          <span className="text-2xl">{meta.flag}</span>
                          <span className="font-bold">{curr}</span>
                          <span className="text-gray-600">{meta.symbol}</span>
                          <span className="text-gray-500">·</span>
                          <span className="text-gray-600 flex-1">{meta.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <p className="mt-2 text-xs text-gray-500 leading-relaxed">
              💡 המרות הן לפי שער יציג, ייתכנו עמלות נוספות לפי כרטיס האשראי/בנק.
            </p>
          </div>

          {/* Adults */}
          <div>
            <label htmlFor="adults" className="block text-gray-700 font-semibold mb-2">
              מספר מבוגרים
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-2xl font-bold"
              >
                −
              </button>
              <input
                type="number"
                id="adults"
                value={adults}
                onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                required
                className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg text-center font-bold"
              />
              <button
                type="button"
                onClick={() => setAdults(adults + 1)}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-2xl font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Children */}
          <div>
            <label htmlFor="children" className="block text-gray-700 font-semibold mb-2">
              מספר ילדים
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setChildren(Math.max(0, children - 1))}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-2xl font-bold"
              >
                −
              </button>
              <input
                type="number"
                id="children"
                value={children}
                onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                min="0"
                required
                className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg text-center font-bold"
              />
              <button
                type="button"
                onClick={() => setChildren(children + 1)}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-2xl font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-gray-700 font-semibold mb-3">
              סגנון הטיול
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(Object.entries(TRAVEL_STYLE_LABELS) as [TravelStyle, string][]).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setTravelStyle(value)}
                  className={`py-4 px-4 rounded-xl border-2 transition-all font-medium ${
                    travelStyle === value
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Other Style Input */}
          {travelStyle === "other" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <label htmlFor="tripStyleOther" className="block text-gray-700 font-semibold mb-2">
                תאר את סגנון הטיול שלך
              </label>
              <input
                type="text"
                id="tripStyleOther"
                value={tripStyleOther}
                onChange={(e) => setTripStyleOther(e.target.value)}
                required
                placeholder="למשל: טיול אתגרי, טיול קולינרי..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-l from-cyan-600 via-blue-600 to-sky-700 text-white py-5 px-8 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mt-8"
          >
            🚀 התחל טיול
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            כל הנתונים נשמרים במכשיר שלך באופן מאובטח
          </p>
        </div>
      </div>
    </div>
  );
}
