import { compare } from "bcrypt";
import { CredentialsSignin } from "next-auth";
import { prisma } from "@/prisma/prisma-client";
import {
  createOrRefreshVerificationCode,
  isVerificationCodeExpired,
} from "@/lib/verification";

class EmailNotVerifiedError extends CredentialsSignin {
  code = "email_not_verified";
}

class InvalidVerificationCodeError extends CredentialsSignin {
  code = "invalid_verification_code";
}

class ExpiredVerificationCodeError extends CredentialsSignin {
  code = "expired_verification_code";
}

type AuthUserRecord = {
  id: string;
  email: string;
  name: string;
  role: string;
};

function toAuthUser(user: {
  id: number;
  email: string;
  fullName: string;
  role: string;
}): AuthUserRecord {
  return {
    id: String(user.id),
    email: user.email,
    name: user.fullName,
    role: user.role,
  };
}

export async function authorizeWithPassword(
  email: string,
  password: string,
): Promise<AuthUserRecord | null> {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user?.password) {
    return null;
  }

  const isValid = await compare(password, user.password);

  if (!isValid) {
    return null;
  }

  if (!user.verified) {
    throw new EmailNotVerifiedError();
  }

  return toAuthUser(user);
}

export async function authorizeWithVerificationCode(
  email: string,
  code: string,
): Promise<AuthUserRecord> {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { verificationCodes: true },
  });

  if (!user) {
    throw new InvalidVerificationCodeError();
  }

  if (user.verified) {
    return toAuthUser(user);
  }

  const verification = user.verificationCodes;

  if (!verification || isVerificationCodeExpired(verification.createdAt)) {
    await createOrRefreshVerificationCode(user.id, user.email);
    throw new ExpiredVerificationCodeError();
  }

  if (verification.code !== code) {
    throw new InvalidVerificationCodeError();
  }

  const verifiedUser = await prisma.$transaction(async (tx) => {
    const updated = await tx.user.update({
      where: { id: user.id },
      data: { verified: new Date() },
    });

    await tx.verificationCode.delete({ where: { userId: user.id } });

    return updated;
  });

  return toAuthUser(verifiedUser);
}
