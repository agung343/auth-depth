// import GitHub from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth"
import { LoginSchema } from "./schema";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";

export default {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
    Credentials({
        async authorize(credential) {
            const validateFields = LoginSchema.safeParse(credential)

            if (validateFields.success) {
                const {email, password} = validateFields.data;

                const user = await getUserByEmail(email)

                if (!user || !user.password) {
                    return null
                }

                const matchPassword = await bcrypt.compare(password, user.password)
                if (matchPassword) return user;
            }
            return null
        }
    })
  ],
} satisfies NextAuthConfig