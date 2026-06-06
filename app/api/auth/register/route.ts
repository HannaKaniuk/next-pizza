import { hash } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { isDevEmailMode } from "@/lib/send-verification-email";
import { createOrRefreshVerificationCode } from "@/lib/verification";

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "Заповніть усі поля" },
        { status: 400 },
      );
    }

    if (String(password).length < 8) {
      return NextResponse.json(
        { message: "Пароль має бути не менше 8 символів" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing?.verified) {
      return NextResponse.json(
        { message: "Користувач з таким email вже існує" },
        { status: 409 },
      );
    }

    const user =
      existing ??
      (await prisma.user.create({
        data: {
          fullName: String(fullName).trim(),
          email: normalizedEmail,
          password: await hash(String(password), 10),
          verified: null,
        },
      }));

    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: {
          fullName: String(fullName).trim(),
          password: await hash(String(password), 10),
        },
      });
    }

    const code = await createOrRefreshVerificationCode(user.id, user.email);

    return NextResponse.json({
      needsVerification: true,
      email: normalizedEmail,
      message: isDevEmailMode()
        ? "Email не налаштовано — використайте код нижче"
        : "На email надіслано код підтвердження",
      ...(isDevEmailMode() ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
