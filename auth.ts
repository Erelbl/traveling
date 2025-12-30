import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Resend({
      from: "noreply@yourdomain.com", // Change this to your verified domain
    }),
  ],
  pages: {
    signIn: "/signin",
    verifyRequest: "/verify-request",
  },
});

// Export for middleware and other usage
export { auth, signIn, signOut };

// Export handlers for Next.js App Router
export const GET = handlers.GET;
export const POST = handlers.POST;

