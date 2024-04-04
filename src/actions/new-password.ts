"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { NewPasswordSchema } from "../../schema/index";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs"


export async function newPassword(
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) {
    if (!token) {
        return {
            error: "Not Authorize"
        }
    }

    const validateFields = NewPasswordSchema.safeParse(values)
    if (!validateFields.success) {
        return {
            error: "Invalid fields"
        }
    }

    const { password} = validateFields.data

    const existingToken = await getPasswordResetTokenByToken(token)
    if (!existingToken) {
        return {
            error: "Not Authorize"
        }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
        return {
            error: "Token has been expired"
        }
    }

    const existingUser = await getUserByEmail(existingToken.email)
    if (!existingUser) {
        return {
            error : "Email is not exist"
        }
    }

    const hashed = await bcrypt.hash(password, 12)

    await db.user.update({
        where: {id: existingUser.id},
        data: {password: hashed}
    })

    await db.passwordResetToken.delete({
        where: {id: existingToken.id}
    })
    
    return {
        success: "Password updated"
    }
}
