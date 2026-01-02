import Link from 'next/link';

export default function TripNotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
          <span className="text-6xl">🔍</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          טיול לא נמצא
        </h1>
        
        <p className="text-gray-600 mb-8">
          הטיול שחיפשת לא קיים או שאין לך הרשאה לצפות בו.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/trips"
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
          >
            כל הטיולים
          </Link>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg"
          >
            דף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}

