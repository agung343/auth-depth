import NextAuth, { type DefaultSession } from "next-auth";
import { UserRole } from "@prisma/client";

export type ExtendedUser = DefaultSession["user"] & {
    // id : string
    role: UserRole
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

import { JWT } from "next-auth/jwt";
declare module "next-auth" {
    interface JWT {
        role?: "ADMIN" | "USER"
    }
}
