import type { Ingredient, ProductItem } from "@/lib/generated/prisma";

export type ProductForModal = {
  id: number;
  name: string;
  imageUrl: string;
  ingredients: Pick<Ingredient, "id" | "name" | "price" | "imageUrl">[];
  items: Pick<
    ProductItem,
    "id" | "price" | "size" | "productType" | "productId"
  >[];
};
