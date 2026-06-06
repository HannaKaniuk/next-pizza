import { prisma } from "@/prisma/prisma-client";
import { sendVerificationEmail } from "@/lib/send-verification-email";

const VERIFICATION_CODE_TTL_MS = 15 * 60 * 1000;

function generateVerificationCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function isVerificationCodeExpired(createdAt: Date) {
  return Date.now() - createdAt.getTime() > VERIFICATION_CODE_TTL_MS;
}

export async function createOrRefreshVerificationCode(
  userId: number,
  email: string,
) {
  const code = generateVerificationCode();

  await prisma.verificationCode.upsert({
    where: { userId },
    create: { userId, code },
    update: { code, createdAt: new Date() },
  });

  await sendVerificationEmail(email, code);

  return code;
}
