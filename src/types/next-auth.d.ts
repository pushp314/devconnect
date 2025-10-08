import NextAuth, { type DefaultSession } from "next-auth";
import type { User as PrismaUser, Role } from '@prisma/client';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string | null;
      role: Role;
      purchasedComponentIds: string[];
    } & DefaultSession["user"] & Omit<PrismaUser, 'id' | 'email' | 'name' | 'image' | 'emailVerified' | 'role' | 'purchasedComponentIds'>;
  }
}
