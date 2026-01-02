"use client";

import { useState, useEffect } from "react";
import { Trip, TRAVEL_STYLE_LABELS } from "@/types/trip";
import CreateTripForm from "@/components/CreateTripForm";
import TripDashboard from "@/components/TripDashboard";
import { getCurrencyMeta } from "@/types/expense";
import { sanitizeTripData } from "@/lib/validation";
import CreateTripButton from "@/components/CreateTripButton";

type TabType = "home" | "add" | "reports" | "trip";

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

function BottomNavigation({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50">
      <div className="max-w-5xl mx-auto px-2 py-2">
        <div className="flex items-center justify-around">
          <button
            onClick={() => onTabChange("home")}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
              activeTab === "home" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill={activeTab === "home" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "home" ? "0" : "2"} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs font-medium">בית</span>
          </button>

          <button
            onClick={() => onTabChange("reports")}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
              activeTab === "reports" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill={activeTab === "reports" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "reports" ? "0" : "2"} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs font-medium">דוחות</span>
          </button>

          <button onClick={() => onTabChange("add")} className="relative -mt-6">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${
              activeTab === "add" ? "bg-gradient-to-br from-blue-600 to-cyan-600 scale-110" : "bg-gradient-to-br from-cyan-500 to-blue-500 hover:scale-105"
            }`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => onTabChange("trip")}
            className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all ${
              activeTab === "trip" ? "text-blue-600" : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <svg className="w-6 h-6 mb-1" fill={activeTab === "trip" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === "trip" ? "0" : "2"} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium">טיול</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

interface TabContentProps {
  trip: Trip;
  onResetTrip: () => void;
}

function HomeTab({ trip, onResetTrip }: TabContentProps) {
  return <TripDashboard trip={trip} onResetTrip={onResetTrip} />;
}

function AddExpenseTab({ trip }: { trip: Trip }) {
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">הוספת הוצאה</h1>
            <p className="text-gray-600">ל{trip.name}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-sky-100">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-sky-100 flex items-center justify-center">
                <span className="text-3xl">💰</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">בקרוב...</h3>
              <p className="text-gray-500 leading-relaxed">
                כאן תוכל להוסיף הוצאה חדשה<br />עם כל הפרטים: סכום, קטגוריה, מדינה ועוד
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsTab({ trip }: { trip: Trip }) {
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">דוחות וניתוחים</h1>
            <p className="text-gray-600">ל{trip.name}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">גרף הוצאות</h3>
                  <p className="text-sm text-gray-500">לפי קטגוריות</p>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-400 text-sm">בקרוב</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">מפת הוצאות</h3>
                  <p className="text-sm text-gray-500">לפי מדינות</p>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-400 text-sm">בקרוב</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl">📈</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">מגמות</h3>
                  <p className="text-sm text-gray-500">הוצאות לאורך זמן</p>
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-400 text-sm">בקרוב</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TripDetailsTab({ trip, onResetTrip }: TabContentProps) {
  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="px-6 pt-8 pb-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">פרטי הטיול</h1>
            <p className="text-gray-600">{trip.name}</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-xl">📝</span>
                  </div>
                  <span className="text-gray-600 font-medium">שם הטיול</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{trip.name}</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                    <span className="text-xl">📅</span>
                  </div>
                  <span className="text-gray-600 font-medium">תאריך התחלה</span>
                </div>
                <span className="text-lg font-bold text-gray-900">
                  {new Date(trip.startDate).toLocaleDateString("he-IL")}
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
                    <span className="text-xl">💰</span>
                  </div>
                  <span className="text-gray-600 font-medium">מטבע בסיס</span>
                </div>
                <span className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">{getCurrencyMeta(trip.baseCurrency).flag}</span>
                  <span>{trip.baseCurrency}</span>
                  <span className="text-gray-600">{getCurrencyMeta(trip.baseCurrency).symbol}</span>
                </span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-xl">👨‍👩‍👧‍👦</span>
                  </div>
                  <span className="text-gray-600 font-medium">מספר מטיילים</span>
                </div>
                <div className="text-left">
                  <div className="text-lg font-bold text-gray-900">
                    {trip.adults} {trip.adults === 1 ? "מבוגר" : "מבוגרים"}
                  </div>
                  {trip.children > 0 && (
                    <div className="text-sm text-gray-600">
                      + {trip.children} {trip.children === 1 ? "ילד" : "ילדים"}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-sky-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                    <span className="text-xl">✈️</span>
                  </div>
                  <span className="text-gray-600 font-medium">סגנון טיול</span>
                </div>
                <div className="text-left">
                  <span className="text-lg font-bold text-gray-900">
                    {TRAVEL_STYLE_LABELS[trip.travelStyle]}
                  </span>
                  {trip.travelStyle === "other" && trip.tripStyleOther && (
                    <div className="text-sm text-gray-600 mt-1">
                      {trip.tripStyleOther}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={onResetTrip}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-4 px-6 rounded-xl font-semibold transition-all border-2 border-red-200 hover:border-red-300"
              >
                🗑️ מחק טיול
              </button>
              <p className="text-center text-gray-400 text-xs mt-2">פעולה זו תמחק את כל הנתונים</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("home");

  useEffect(() => {
    const savedTrip = localStorage.getItem("current_trip");
    if (savedTrip) {
      try {
        const rawTrip = JSON.parse(savedTrip);
        // Sanitize trip data to ensure baseCurrency and other fields are valid
        const sanitizedTrip = sanitizeTripData(rawTrip);
        if (sanitizedTrip) {
          setCurrentTrip(sanitizedTrip);
          // If data was sanitized (fixed), save it back to localStorage
          if (sanitizedTrip.baseCurrency !== rawTrip.baseCurrency) {
            console.log("Trip data was sanitized, saving updated version");
            localStorage.setItem("current_trip", JSON.stringify(sanitizedTrip));
          }
        } else {
          console.error("Invalid trip data in localStorage");
          localStorage.removeItem("current_trip");
        }
      } catch (error) {
        console.error("Error loading trip:", error);
        localStorage.removeItem("current_trip");
      }
    }
    setIsLoading(false);
  }, []);

  const handleTripCreated = (trip: Trip) => {
    setCurrentTrip(trip);
  };

  const handleResetTrip = () => {
    if (confirm("האם אתה בטוח שברצונך למחוק את הטיול? כל הנתונים יימחקו.")) {
      localStorage.removeItem("current_trip");
      setCurrentTrip(null);
      setActiveTab("home");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return <CreateTripForm onTripCreated={handleTripCreated} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
      <div className="pb-20">
        {activeTab === "home" && <HomeTab trip={currentTrip} onResetTrip={handleResetTrip} />}
        {activeTab === "add" && <AddExpenseTab trip={currentTrip} />}
        {activeTab === "reports" && <ReportsTab trip={currentTrip} />}
        {activeTab === "trip" && <TripDetailsTab trip={currentTrip} onResetTrip={handleResetTrip} />}
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <CreateTripButton onTripCreated={() => console.log('Trip created!')} />
    </div>
  );
}
