import { db } from "@/lib/db";

export async function getPasswordResetTokenByToken(token: string) {
  try {
    const passwordToken = await db.passwordResetToken.findUnique({
      where: { token },
    });

    return passwordToken;
  } catch (error) {
    return null;
  }
}

export async function getPasswordResetTokenByEmail(email: string) {
  try {
    const passwordToken = await db.passwordResetToken.findFirst({
      where: { email },
    });

    return passwordToken;
  } catch (error) {
    return null;
  }
}
