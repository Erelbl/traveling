import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: process.env.AUTH_EMAIL_FROM ?? "Trip Finance <onboarding@resend.dev>",
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
  },
  debug: true, // Enable debug logging
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

