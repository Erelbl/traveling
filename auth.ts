import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

// Log environment configuration on module load
console.log('[Auth] Environment check:');
console.log('  AUTH_RESEND_KEY:', process.env.AUTH_RESEND_KEY ? '✓ Set' : '✗ Missing');
console.log('  AUTH_EMAIL_FROM:', process.env.AUTH_EMAIL_FROM || 'Using default: Trip Finance <onboarding@resend.dev>');
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✓ Set' : '✗ Missing');

const resendApiKey = process.env.AUTH_RESEND_KEY;
const emailFrom = process.env.AUTH_EMAIL_FROM ?? "Trip Finance <onboarding@resend.dev>";

if (!resendApiKey) {
  console.error('[Auth] ERROR: AUTH_RESEND_KEY is not set! Email sending will fail.');
}

const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: resendApiKey,
      from: emailFrom,
      // Additional logging for Resend provider
      async sendVerificationRequest({ identifier: email, url, provider }) {
        console.log('[Auth] Resend: sendVerificationRequest called');
        console.log('  Email:', email);
        console.log('  URL:', url);
        console.log('  Provider:', provider.id);
        console.log('  API Key set:', !!resendApiKey);
        console.log('  From address:', emailFrom);
        
        // Call the default implementation
        const { Resend } = await import('resend');
        const resend = new Resend(resendApiKey);
        
        try {
          const result = await resend.emails.send({
            from: emailFrom,
            to: email,
            subject: 'התחברות ל-Trip Finance',
            html: `
              <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0891b2;">ברוכים הבאים ל-Trip Finance</h2>
                <p>לחץ על הכפתור למטה כדי להיכנס לחשבון שלך:</p>
                <a href="${url}" style="display: inline-block; background: linear-gradient(to right, #06b6d4, #2563eb); color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0;">
                  התחבר לחשבון
                </a>
                <p style="color: #666; font-size: 14px;">אם לא ביקשת להתחבר, אתה יכול להתעלם מאימייל זה.</p>
                <p style="color: #666; font-size: 14px;">הקישור תקף ל-24 שעות.</p>
              </div>
            `,
          });
          
          console.log('[Auth] Resend: Email sent successfully', result);
        } catch (error) {
          console.error('[Auth] Resend: Failed to send email', error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[NextAuth] signIn callback:', { user, account, email });
      return true;
    },
  },
});

// Export for middleware and other usage
export { auth, signIn, signOut };

// Export handlers for Next.js App Router
export const GET = handlers.GET;
export const POST = handlers.POST;

console.log("AUTH_RESEND_KEY set?", !!process.env.AUTH_RESEND_KEY);
console.log("AUTH_EMAIL_FROM:", process.env.AUTH_EMAIL_FROM);
