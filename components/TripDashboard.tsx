"use client";

import { useState } from "react";
import Link from "next/link";
import { Trip } from "@/types/trip";
import { getCurrencyMeta } from "@/types/expense";

interface TripDashboardProps {
  trip: Trip;
  onResetTrip: () => void;
}

export default function TripDashboard({ trip, onResetTrip }: TripDashboardProps) {
  const [isAddingExpense, setIsAddingExpense] = useState(false);

  return (
    <main className="min-h-screen pb-20">
      <div className="relative overflow-hidden bg-gradient-to-l from-cyan-600 via-blue-600 to-sky-700 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-300 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative px-6 pt-8 pb-16">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onResetTrip}
              className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              הגדרות
            </button>
            <Link
              href="/my-trips"
              className="text-white/80 hover:text-white transition-colors text-sm flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              הטיולים שלי
            </Link>
          </div>

          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="1.5"/>
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="1.5"/>
              </svg>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 leading-tight">
            {trip.name}
          </h1>
          
          <div className="flex justify-center items-center gap-4 text-cyan-50">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">{new Date(trip.startDate).toLocaleDateString('he-IL')}</span>
            </div>
            <span className="text-cyan-300">•</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm">
                {trip.adults} {trip.adults === 1 ? "מבוגר" : "מבוגרים"}
                {trip.children > 0 && ` + ${trip.children} ${trip.children === 1 ? "ילד" : "ילדים"}`}
              </span>
            </div>
            <span className="text-cyan-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-lg">{getCurrencyMeta(trip.baseCurrency).flag}</span>
              <span className="text-sm font-semibold">{trip.baseCurrency}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">סה״כ הוצאות</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">₪0</p>
            <p className="text-xs text-gray-400">טרם נוספו הוצאות</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-blue-400 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">ממוצע ליום</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">₪0</p>
            <p className="text-xs text-gray-400">מחושב לפי ימי הטיול</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-400 flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">מספר מדינות</p>
            <p className="text-3xl font-bold text-gray-900 mb-1">0</p>
            <p className="text-xs text-gray-400">יעודכן עם הוספת הוצאות</p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 max-w-5xl mx-auto">
        <button
          onClick={() => setIsAddingExpense(!isAddingExpense)}
          className="w-full bg-gradient-to-l from-cyan-600 via-blue-600 to-sky-700 text-white py-5 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          הוסף הוצאה חדשה
        </button>
      </div>

      <div className="px-4 mt-12 max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-sky-100 to-cyan-100 flex items-center justify-center">
              <svg className="w-10 h-10 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">גרפים וניתוחים</h3>
            <p className="text-gray-500 leading-relaxed max-w-md mx-auto">
              כאן יופיעו גרפים מתקדמים של ההוצאות שלך לפי קטגוריות, מדינות וזמן
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 mt-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-l from-cyan-50 to-sky-50 rounded-2xl p-6 border border-cyan-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-500 flex items-center justify-center flex-shrink-0 mt-1">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">טיפ לטיול חסכוני</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                רשמו כל הוצאה בזמן אמת כדי לשמור על תקציב מדויק ולזהות איפה אתם מוציאים הכי הרבה
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

