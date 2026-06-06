import { prisma } from "@/prisma/prisma-client";
import {
  buildProductWhere,
  type ProductFilterParams,
} from "@/lib/product-filters";

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

export async function getCategoriesWithProducts(
  filters?: ProductFilterParams,
): Promise<HomeCategory[]> {
  const productWhere = filters ? buildProductWhere(filters) : {};

  const categories = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: {
      products: {
        where: productWhere,
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

  return categories
    .map((category) => ({
      id: category.id,
      name: category.name,
      anchorId: `category-${category.id}`,
      products: category.products.map((product) => ({
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.items[0]?.price ?? 0,
      })),
    }))
    .filter((category) => category.products.length > 0);
}
