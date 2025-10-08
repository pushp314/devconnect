import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import type { Adapter } from "next-auth/adapters";
import type { User, Role } from "@prisma/client";

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
    async session({ session, user }) {
      if (session.user) {
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
        });
        session.user.id = user.id;
        session.user.username = dbUser?.username ?? null;
        session.user.role = dbUser?.role ?? 'USER';
        (session.user as any).purchasedComponentIds = dbUser?.purchasedComponentIds ?? [];

      }
      return session;
    },
  },
  events: {
    createUser: async ({ user }) => {
      if (user.email) {
        // Create a unique username from the email
        const username = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
        
        // Check if username exists and append a random number if it does
        let finalUsername = username;
        let userExists = await db.user.findUnique({ where: { username: finalUsername } });
        let attempts = 0;
        while(userExists && attempts < 5) {
            finalUsername = `${username}${Math.floor(Math.random() * 1000)}`;
            userExists = await db.user.findUnique({ where: { username: finalUsername } });
            attempts++;
        }
        if (userExists) { // Fallback for rare case of multiple collisions
             finalUsername = `${username}-${Date.now()}`;
        }

        await db.user.update({
          where: { id: user.id },
          data: { username: finalUsername },
        });
      }
    },
  },
  secret: process.env.AUTH_SECRET,
});
