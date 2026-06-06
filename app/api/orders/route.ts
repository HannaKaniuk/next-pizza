import { NextRequest, NextResponse } from "next/server";
import { OrderStatus } from "@/lib/generated/prisma";
import { prisma } from "@/prisma/prisma-client";
import {
  getCartItemUnitPrice,
  mapCartItemToDTO,
  resolveCart,
} from "@/lib/cart-server";
import { getUserFromRequest } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
  try {
    const { cart } = await resolveCart(req);

    if (!cart || cart.cartItems.length === 0) {
      return NextResponse.json(
        { message: "Кошик порожній" },
        { status: 400 },
      );
    }

    const user = await getUserFromRequest();
    const body = (await req.json().catch(() => ({}))) as {
      fullName?: string;
      email?: string;
      phone?: string;
      address?: string;
      comment?: string;
    };

    const items = cart.cartItems.map((item) => ({
      ...mapCartItemToDTO(item),
      ingredientIds: item.ingredients.map((ingredient) => ingredient.id),
    }));

    const totalAmount = cart.cartItems.reduce(
      (sum, item) =>
        sum +
        getCartItemUnitPrice(item.productItem, item.ingredients) *
          item.quantity,
      0,
    );

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: user?.id,
          token: cart.token,
          totalAmout: totalAmount,
          status: OrderStatus.SUCCEEDED,
          items,
          fullName: body.fullName?.trim() || user?.fullName || "Гість",
          email: body.email?.trim() || user?.email || "guest@local",
          phone: body.phone?.trim() || "—",
          address: body.address?.trim() || "Самовивіз",
          comment: body.comment?.trim() || null,
        },
        select: { id: true },
      });

      await tx.cartItem.deleteMany({ where: { cardId: cart.id } });
      await tx.cart.update({
        where: { id: cart.id },
        data: { totalAmount: 0 },
      });

      return created;
    });

    return NextResponse.json({
      orderId: order.id,
      message: "Дякуємо за покупку!",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Помилка сервера" }, { status: 500 });
  }
}
