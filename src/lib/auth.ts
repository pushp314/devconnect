import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import type { Adapter } from "next-auth/adapters";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      // Add the user ID to the session
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});
