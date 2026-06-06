import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import { buildCartResponse, resolveCartId } from "@/lib/cart-server";

type RouteContext = {
  params: Promise<{ itemId: string }>;
};

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { itemId } = await context.params;
    const cartItemId = Number(itemId);
    const { quantity } = await req.json();

    if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
      return NextResponse.json({ message: "Невірний id" }, { status: 400 });
    }

    const nextQuantity = Number(quantity);
    if (!Number.isInteger(nextQuantity) || nextQuantity < 1) {
      return NextResponse.json(
        { message: "Кількість має бути не менше 1" },
        { status: 400 },
      );
    }

    const { cartId } = await resolveCartId(req);

    if (!cartId) {
      return NextResponse.json({ message: "Кошик порожній" }, { status: 404 });
    }

    const updated = await prisma.cartItem.updateMany({
      where: { id: cartItemId, cardId: cartId },
      data: { quantity: nextQuantity },
    });

    if (updated.count === 0) {
      return NextResponse.json({ message: "Позицію не знайдено" }, { status: 404 });
    }

    return NextResponse.json(await buildCartResponse(cartId));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { itemId } = await context.params;
    const cartItemId = Number(itemId);

    if (!Number.isInteger(cartItemId) || cartItemId <= 0) {
      return NextResponse.json({ message: "Невірний id" }, { status: 400 });
    }

    const { cartId } = await resolveCartId(req);

    if (!cartId) {
      return NextResponse.json({ message: "Кошик порожній" }, { status: 404 });
    }

    const deleted = await prisma.cartItem.deleteMany({
      where: { id: cartItemId, cardId: cartId },
    });

    if (deleted.count === 0) {
      return NextResponse.json({ message: "Позицію не знайдено" }, { status: 404 });
    }

    return NextResponse.json(await buildCartResponse(cartId));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
