'use server'

import * as z from "zod"
import { ResetSchema } from "../../schema";
import { getUserByEmail } from "@/data/user";
import { generatePasswordResetToken } from "@/lib/token";
import { sendPasswordResetEmail } from "@/data/mails";

export async function reset(values: z.infer<typeof  ResetSchema>) {
    const validateFields = ResetSchema.safeParse(values)

    if (!validateFields.success) {
        return {
            error: "Please enter a valid email"
        }
    }

    const {email} = validateFields.data;

    const existingEmail = getUserByEmail(email)
    if (!existingEmail) {
        return {
            error: "Email not found. Can not send email"
        }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return {
        success: "Email has been sent"
    }
}