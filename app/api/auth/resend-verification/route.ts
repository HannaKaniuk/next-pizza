import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { isDevEmailMode } from "@/lib/send-verification-email";
import { createOrRefreshVerificationCode } from "@/lib/verification";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Вкажіть email" },
        { status: 400 },
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Користувача не знайдено. Спочатку пройдіть реєстрацію з цим email.",
        },
        { status: 400 },
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { message: "Email вже підтверджено" },
        { status: 400 },
      );
    }

    const code = await createOrRefreshVerificationCode(user.id, user.email);

    return NextResponse.json({
      message: isDevEmailMode()
        ? "Email не налаштовано — використайте код нижче"
        : "Код надіслано на email",
      email: normalizedEmail,
      ...(isDevEmailMode() ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
