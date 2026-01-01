'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, FormEvent } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      await signIn('resend', { email, callbackUrl: '/' });
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          התחברות למערכת
        </h1>

        {/* Status Badge */}
        <div className="mb-6 text-center">
          <span
            className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
              status === 'loading'
                ? 'bg-yellow-100 text-yellow-800'
                : status === 'authenticated'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            סטטוס: {status === 'loading' ? 'טוען...' : status === 'authenticated' ? 'מחובר' : 'לא מחובר'}
          </span>
        </div>

        {/* Content based on auth status */}
        {status === 'loading' && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <p className="mt-4 text-gray-600">טוען מידע...</p>
          </div>
        )}

        {status === 'unauthenticated' && (
          <div>
            <p className="mb-6 text-gray-600 text-center">
              היכנס עם המייל שלך כדי להתחיל לנהל את הוצאות הטיול
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  כתובת מייל
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                  dir="ltr"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'שולח...' : 'התחבר עם אימייל'}
              </button>
            </form>
          </div>
        )}

        {status === 'authenticated' && session && (
          <div>
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                שלום! 👋
              </h2>
              <p className="text-gray-600">
                {session.user?.email || 'משתמש'}
              </p>
            </div>

            {/* Session JSON */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                פרטי Session:
              </h3>
              <pre className="bg-gray-50 p-4 rounded-lg text-xs overflow-x-auto text-left" dir="ltr">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            {/* Sign Out Button */}
            <div className="flex gap-3">
              <button
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
              >
                התנתק
              </button>
              <a
                href="/"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg text-center"
              >
                לעמוד הראשי
              </a>
            </div>
          </div>
        )}

        {/* API Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            API Endpoint:{' '}
            <a
              href="/api/auth/session"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-600 hover:underline"
            >
              /api/auth/session
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

