export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-sans dark:from-gray-900 dark:to-gray-800">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-16 px-8">
        <div className="flex flex-col items-center gap-12 text-center">
          <h1 className="text-6xl md:text-7xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
            ניהול הוצאות טיול
          </h1>
          
          <p className="max-w-2xl text-xl md:text-2xl leading-relaxed text-gray-700 dark:text-gray-300">
            נהל את ההוצאות שלך בצורה פשוטה ויעילה
          </p>

          <button className="group relative flex h-16 w-full max-w-xs items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 active:scale-95">
            <svg
              className="h-6 w-6 transition-transform group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            הוסף הוצאה
          </button>
        </div>
      </main>
    </div>
  );
}
