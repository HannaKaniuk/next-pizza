import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma/prisma-client";
import {
  buildCartResponse,
  CART_COOKIE,
  findMatchingCartItem,
  mapCartItemToDTO,
  resolveCart,
  resolveCartId,
} from "@/lib/cart-server";

function setCartCookie(response: NextResponse, token: string) {
  response.cookies.set(CART_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

function cartResponse(
  items: ReturnType<typeof mapCartItemToDTO>[],
  totalAmount: number,
  newCartToken: string | null,
) {
  const response = NextResponse.json({ items, totalAmount });
  if (newCartToken) {
    setCartCookie(response, newCartToken);
  }
  return response;
}

export async function GET(req: NextRequest) {
  try {
    const { cart } = await resolveCart(req);

    if (!cart) {
      return NextResponse.json({ items: [], totalAmount: 0 });
    }

    return NextResponse.json({
      items: cart.cartItems.map(mapCartItemToDTO),
      totalAmount: cart.totalAmount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productItemId = Number(body.productItemId);
    const quantity = Math.max(1, Number(body.quantity) || 1);
    const ingredientIds = Array.isArray(body.ingredientIds)
      ? body.ingredientIds.map(Number).filter((id: number) => id > 0)
      : [];

    if (!Number.isInteger(productItemId) || productItemId <= 0) {
      return NextResponse.json(
        { message: "Невірний товар" },
        { status: 400 },
      );
    }

    const productItem = await prisma.productItem.findUnique({
      where: { id: productItemId },
    });

    if (!productItem) {
      return NextResponse.json(
        { message: "Товар не знайдено" },
        { status: 404 },
      );
    }

    const { cartId, newCartToken } = await resolveCartId(req, true);

    if (!cartId) {
      return NextResponse.json({ message: "Кошик недоступний" }, { status: 500 });
    }

    const existing = await findMatchingCartItem(
      cartId,
      productItemId,
      ingredientIds,
    );

    if (existing) {
      await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cardId: cartId,
          productItemId,
          quantity,
          ingredients: {
            connect: ingredientIds.map((id: number) => ({ id })),
          },
        },
      });
    }

    const { items, totalAmount } = await buildCartResponse(cartId);

    return cartResponse(items, totalAmount, newCartToken);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
