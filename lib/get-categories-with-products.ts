import { prisma } from "@/prisma/prisma-client";

export type HomeCategory = {
  id: number;
  name: string;
  anchorId: string;
  products: {
    id: number;
    name: string;
    imageUrl: string;
    price: number;
  }[];
};

export async function getCategoriesWithProducts(): Promise<HomeCategory[]> {
  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: {
      products: {
        orderBy: { id: "asc" },
        include: {
          items: {
            orderBy: { price: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    anchorId: `category-${category.id}`,
    products: category.products.map((product) => ({
      id: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.items[0]?.price ?? 0,
    })),
  }));
}
