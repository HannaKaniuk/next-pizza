import { cache } from "react";
import { prisma } from "@/prisma/prisma-client";

export const getProductById = cache(async (id: number) => {
  if (!Number.isInteger(id) || id <= 0) return null;

  return prisma.product.findFirst({
    where: { id },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      ingredients: {
        orderBy: { id: "asc" },
        select: {
          id: true,
          name: true,
          price: true,
          imageUrl: true,
        },
      },
      items: {
        orderBy: { price: "asc" },
        select: {
          id: true,
          price: true,
          size: true,
          productType: true,
          productId: true,
        },
      },
    },
  });
});
