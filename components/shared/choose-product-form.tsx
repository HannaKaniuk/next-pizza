"use client";

import Image from "next/image";
import React, { useMemo, useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PRODUCT_FALLBACK_IMAGE_URL } from "@/lib/constants";
import type { ProductItem } from "@/lib/generated/prisma";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { Button } from "../ui";
import { ProductImage } from "./product-image";
import { Title } from "./title";

type ProductIngredient = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
};

type Props = {
  className?: string;
  imageUrl: string;
  name: string;
  ingredients: ProductIngredient[];
  items: Pick<
    ProductItem,
    "id" | "price" | "size" | "productType" | "productId"
  >[];
  detailsLoading?: boolean;
  onAddToCartSuccess?: () => void;
};

export const ChooseProductForm: React.FC<Props> = ({
  className,
  imageUrl,
  name,
  ingredients,
  items,
  detailsLoading = false,
  onAddToCartSuccess,
}) => {
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<
    Set<number>
  >(() => new Set());
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const baseItem = useMemo(() => {
    if (!items.length) return null;
    return items.reduce((min, item) => (item.price < min.price ? item : min));
  }, [items]);

  const totalPrice = useMemo(() => {
    if (!baseItem) return 0;

    const ingredientsPrice = ingredients
      .filter((ingredient) => selectedIngredientIds.has(ingredient.id))
      .reduce((sum, ingredient) => sum + ingredient.price, 0);

    return baseItem.price + ingredientsPrice;
  }, [baseItem, ingredients, selectedIngredientIds]);

  const toggleIngredient = (id: number) => {
    setSelectedIngredientIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddToCart = async () => {
    if (!baseItem) return;

    setAdding(true);
    try {
      await addItem({
        productItemId: baseItem.id,
        ingredientIds: Array.from(selectedIngredientIds),
        quantity: 1,
      });
      onAddToCartSuccess?.();
    } finally {
      setAdding(false);
    }
  };

  const textDetails = detailsLoading
    ? "Завантажуємо опції..."
    : baseItem !== null
      ? `від ${baseItem.price} грн · ${ingredients.length} інгредієнтів`
      : `${ingredients.length} інгредієнтів`;

  return (
    <div className={cn(className, "flex min-h-[500px] w-full")}>
      <ProductImage imageUrl={imageUrl} alt={name} />
      <div className="flex w-[490px] flex-col bg-[#f7f6f5] p-7">
        <Title text={name} size="md" className="mb-1 font-extrabold" />

        <p className="text-gray-400">{textDetails}</p>

        {detailsLoading && (
          <div className="mt-6 space-y-3">
            <Skeleton className="h-4 w-40" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-32 rounded-xl" />
              ))}
            </div>
          </div>
        )}

        {!detailsLoading && ingredients.length > 0 && (
          <div className="mt-6">
            <p className="mb-3 text-sm text-gray-500">Додаткові інгредієнти</p>
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ingredient) => {
                const isSelected = selectedIngredientIds.has(ingredient.id);

                return (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => toggleIngredient(ingredient.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-2 py-2 text-left text-sm shadow-sm transition-colors",
                      isSelected
                        ? "bg-primary/10 ring-primary ring-2"
                        : "bg-white hover:bg-white/80",
                    )}
                  >
                    <Image
                      src={ingredient.imageUrl || PRODUCT_FALLBACK_IMAGE_URL}
                      alt={ingredient.name}
                      width={36}
                      height={36}
                      className="rounded-lg object-cover"
                    />
                    <div className="pr-1 leading-tight">
                      <span className="block">{ingredient.name}</span>
                      <span className="text-xs text-gray-500">
                        +{ingredient.price} грн
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-auto pt-10">
          {detailsLoading ? (
            <Skeleton className="mb-4 h-10 w-32" />
          ) : (
            baseItem !== null && (
              <p className="mb-4 text-[28px] font-black">
                {totalPrice} <span className="text-xl">грн</span>
              </p>
            )
          )}

          <Button
            type="button"
            className="h-14 w-full text-base font-bold"
            disabled={detailsLoading || !baseItem || adding}
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-5 w-5" strokeWidth={2} />
            {adding ? "Додаємо..." : "Додати в кошик"}
          </Button>
        </div>
      </div>
    </div>
  );
};
