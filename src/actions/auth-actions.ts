"use server";
import * as z from "zod";

import { LoginSchema, RegisterSchema } from "../../schema";
import { db } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "@/data/user";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/token";

export async function Login(values: z.infer<typeof LoginSchema>) {
  const validateFields = LoginSchema.safeParse(values);
  console.log(values);

  if (!validateFields.success) {
    return {
      error: "Invalid Fields",
    };
  }

  const { email, password } = validateFields.data;

  const existingUser = await getUserByEmail(email)
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: "Bad Authentication"
    }
  }

  if (existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email)
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            error: "Invalid Credentials",
          };
        default:
          return {
            error: "Something went wrong",
          };
      }
    }
    throw error;
  }

  return {
    success: "Success",
  };
}

export async function Register(values: z.infer<typeof RegisterSchema>) {
  const validateFields = RegisterSchema.safeParse(values);
  console.log(values);

  if (!validateFields.success) {
    return {
      error: "Invalid Fields",
    };
  }

  const { email, password, name } = validateFields.data;
  const hashed = await bcrypt.hash(password, 12);

  const existingEmail = await getUserByEmail(email);

  if (existingEmail) {
    return {
      error: "Email already existed",
    };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  const verificationToken = await generateVerificationToken(email)


  // TODO: Send verification token email

  return {
    success: "Confirmation email success",
  };
}
