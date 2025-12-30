"use client";

import { useState, FormEvent } from "react";
import { Trip, TravelStyle, TRAVEL_STYLE_LABELS } from "@/types/trip";

interface CreateTripFormProps {
  onTripCreated: (trip: Trip) => void;
}

export default function CreateTripForm({ onTripCreated }: CreateTripFormProps) {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [travelersCount, setTravelersCount] = useState(2);
  const [travelStyle, setTravelStyle] = useState<TravelStyle>("other");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newTrip: Trip = {
      id: `trip_${Date.now()}`,
      name,
      startDate,
      travelersCount,
      travelStyle,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("current_trip", JSON.stringify(newTrip));
    
    onTripCreated(newTrip);
  };

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

          <div>
            <label htmlFor="travelersCount" className="block text-gray-700 font-semibold mb-2">
              מספר נפשות
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-2xl font-bold"
              >
                −
              </button>
              <input
                type="number"
                id="travelersCount"
                value={travelersCount}
                onChange={(e) => setTravelersCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                required
                className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-lg text-center font-bold"
              />
              <button
                type="button"
                onClick={() => setTravelersCount(travelersCount + 1)}
                className="w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center text-2xl font-bold"
              >
                +
              </button>
            </div>
          </div>

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

