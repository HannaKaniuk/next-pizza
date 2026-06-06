import { auth } from "@/auth";
import { prisma } from "@/prisma/prisma-client";

export type SessionUser = {
  id: number;
  fullName: string;
  email: string;
  role: string;
};

async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();

  const userId = session?.user?.id ? Number(session.user.id) : null;

  if (!userId || Number.isNaN(userId)) {
    return null;
  }

  const user = await prisma.user.findFirst({
    where: { id: userId, verified: { not: null } },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
    },
  });

  return user;
}

export async function getUserIdFromRequest() {
  const session = await auth();
  const id = session?.user?.id ? Number(session.user.id) : null;

  if (!id || Number.isNaN(id)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function getUserFromRequest() {
  return getSessionUser();
}

export async function getUserFromCookies() {
  return getSessionUser();
}
