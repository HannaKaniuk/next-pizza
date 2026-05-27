import { prisma } from "@/prisma/prisma-client";

export async function getIngredients() {
  return prisma.ingredient.findMany({
    orderBy: { id: "asc" },
    select: {
      id: true,
      name: true,
    },
  });
}
