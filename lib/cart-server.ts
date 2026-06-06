import type { NextRequest } from "next/server";
import type { CartItem, Ingredient, ProductItem } from "@/lib/generated/prisma";
import { prisma } from "@/prisma/prisma-client";
import { getUserIdFromRequest } from "@/lib/server-auth";

export const CART_COOKIE = "cartToken";

const cartInclude = {
  cartItems: {
    orderBy: { id: "asc" as const },
    include: {
      productItem: {
        include: {
          product: true,
        },
      },
      ingredients: true,
    },
  },
} as const;

type CartItemWithRelations = CartItem & {
  productItem: ProductItem & { product: { name: string; imageUrl: string } };
  ingredients: Ingredient[];
};

export type CartItemDTO = {
  id: number;
  productItemId: number;
  imageUrl: string;
  details: string;
  name: string;
  price: number;
  quantity: number;
};

function ingredientIdsKey(ids: number[]) {
  return [...ids].sort((a, b) => a - b).join(",");
}

export function getCartItemUnitPrice(
  productItem: ProductItem,
  ingredients: Ingredient[],
) {
  return (
    productItem.price +
    ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
  );
}

function buildDetails(
  productItem: ProductItem,
  ingredients: Ingredient[],
) {
  const parts: string[] = [];

  if (productItem.size) {
    parts.push(`${productItem.size} см`);
  }

  if (ingredients.length > 0) {
    parts.push(`+${ingredients.length} інгредієнтів`);
  }

  return parts.length > 0 ? parts.join(", ") : "Стандарт";
}

export function mapCartItemToDTO(item: CartItemWithRelations): CartItemDTO {
  const unitPrice = getCartItemUnitPrice(item.productItem, item.ingredients);

  return {
    id: item.id,
    productItemId: item.productItemId,
    imageUrl: item.productItem.product.imageUrl,
    name: item.productItem.product.name,
    details: buildDetails(item.productItem, item.ingredients),
    price: unitPrice,
    quantity: item.quantity,
  };
}

function calcTotalFromItems(
  items: CartItemWithRelations[],
) {
  return items.reduce(
    (sum, item) =>
      sum +
      getCartItemUnitPrice(item.productItem, item.ingredients) * item.quantity,
    0,
  );
}

/** One DB read + optional total update — use after mutations instead of recalc + refetch. */
export async function buildCartResponse(cartId: number) {
  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: cartInclude,
  });

  if (!cart) {
    return { items: [] as CartItemDTO[], totalAmount: 0 };
  }

  const totalAmount = calcTotalFromItems(cart.cartItems);

  if (cart.totalAmount !== totalAmount) {
    await prisma.cart.update({
      where: { id: cartId },
      data: { totalAmount },
    });
  }

  return {
    items: cart.cartItems.map(mapCartItemToDTO),
    totalAmount,
  };
}

async function recalcCartTotal(cartId: number) {
  const { totalAmount } = await buildCartResponse(cartId);
  return totalAmount;
}

async function mergeGuestCartIntoUserCart(guestCartId: number, userCartId: number) {
  const guestItems = await prisma.cartItem.findMany({
    where: { cardId: guestCartId },
    include: { ingredients: true },
  });

  const userItems = await prisma.cartItem.findMany({
    where: { cardId: userCartId },
    include: { ingredients: true },
  });

  for (const guestItem of guestItems) {
    const guestKey = ingredientIdsKey(guestItem.ingredients.map((i) => i.id));
    const match = userItems.find(
      (userItem) =>
        userItem.productItemId === guestItem.productItemId &&
        ingredientIdsKey(userItem.ingredients.map((i) => i.id)) === guestKey,
    );

    if (match) {
      await prisma.cartItem.update({
        where: { id: match.id },
        data: { quantity: match.quantity + guestItem.quantity },
      });
      await prisma.cartItem.delete({ where: { id: guestItem.id } });
    } else {
      await prisma.cartItem.update({
        where: { id: guestItem.id },
        data: { cardId: userCartId },
      });
    }
  }

  await prisma.cart.delete({ where: { id: guestCartId } });
  await recalcCartTotal(userCartId);
}

/** Lightweight lookup for PATCH/DELETE/POST — no guest-cart merge. */
export async function resolveCartId(
  req: NextRequest,
  createIfMissing = false,
) {
  const userId = await getUserIdFromRequest();
  const cartToken = req.cookies.get(CART_COOKIE)?.value;

  if (userId) {
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (userCart) {
      return { cartId: userCart.id, newCartToken: null as string | null };
    }

    if (createIfMissing) {
      if (cartToken) {
        const guestCart = await prisma.cart.findFirst({
          where: { token: cartToken, userId: null },
          select: { id: true },
        });

        if (guestCart) {
          try {
            await prisma.cart.update({
              where: { id: guestCart.id },
              data: { userId },
            });
            return { cartId: guestCart.id, newCartToken: null };
          } catch {
            const userCart = await prisma.cart.findUnique({
              where: { userId },
              select: { id: true },
            });
            if (userCart) {
              await mergeGuestCartIntoUserCart(guestCart.id, userCart.id);
              return { cartId: userCart.id, newCartToken: null };
            }
            throw new Error("Failed to attach guest cart to user");
          }
        }
      }

      const token = cartToken ?? crypto.randomUUID();
      const cart = await prisma.cart.upsert({
        where: { userId },
        create: { userId, token },
        update: {},
        select: { id: true, token: true },
      });
      return { cartId: cart.id, newCartToken: cart.token };
    }

    return { cartId: null, newCartToken: null };
  }

  if (cartToken) {
    const guestCart = await prisma.cart.findFirst({
      where: { token: cartToken, userId: null },
      select: { id: true },
    });

    if (guestCart) {
      return { cartId: guestCart.id, newCartToken: null };
    }
  }

  if (!createIfMissing) {
    return { cartId: null, newCartToken: null };
  }

  const token = crypto.randomUUID();
  const cart = await prisma.cart.create({
    data: { token },
    select: { id: true, token: true },
  });

  return { cartId: cart.id, newCartToken: token };
}

export async function resolveCart(req: NextRequest, createIfMissing = false) {
  const userId = await getUserIdFromRequest();
  const cartToken = req.cookies.get(CART_COOKIE)?.value;

  if (userId) {
    let userCart = await prisma.cart.findUnique({
      where: { userId },
      include: cartInclude,
    });

    if (cartToken) {
      const guestCart = await prisma.cart.findFirst({
        where: { token: cartToken, userId: null },
        include: cartInclude,
      });

      if (guestCart) {
        if (userCart) {
          await mergeGuestCartIntoUserCart(guestCart.id, userCart.id);
          userCart = await prisma.cart.findUnique({
            where: { id: userCart.id },
            include: cartInclude,
          });
        } else {
          userCart = await prisma.cart.update({
            where: { id: guestCart.id },
            data: { userId },
            include: cartInclude,
          });
        }
      }
    }

    if (!userCart && createIfMissing) {
      userCart = await prisma.cart.upsert({
        where: { userId },
        create: {
          userId,
          token: cartToken ?? crypto.randomUUID(),
        },
        update: {},
        include: cartInclude,
      });
    }

    return { cart: userCart, newCartToken: userCart?.token ?? null };
  }

  if (cartToken) {
    const guestCart = await prisma.cart.findFirst({
      where: { token: cartToken, userId: null },
      include: cartInclude,
    });

    if (guestCart) {
      return { cart: guestCart, newCartToken: null };
    }
  }

  if (!createIfMissing) {
    return { cart: null, newCartToken: null };
  }

  const token = crypto.randomUUID();
  const guestCart = await prisma.cart.create({
    data: { token },
    include: cartInclude,
  });

  return { cart: guestCart, newCartToken: token };
}

export async function findMatchingCartItem(
  cartId: number,
  productItemId: number,
  ingredientIds: number[],
) {
  const key = ingredientIdsKey(ingredientIds);
  const items = await prisma.cartItem.findMany({
    where: { cardId: cartId, productItemId },
    include: { ingredients: true },
  });

  return (
    items.find(
      (item) =>
        ingredientIdsKey(item.ingredients.map((i) => i.id)) === key,
    ) ?? null
  );
}
