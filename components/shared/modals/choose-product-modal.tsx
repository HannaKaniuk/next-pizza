"use client";

import { Dialog } from "@/components/ui";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import React from "react";
import { useRouter } from "next/navigation";
import type { Ingredient, Product, ProductItem } from "@/lib/generated/prisma";
import { ChoosePizzaForm } from "../choose-product-form";

type ProductWithDetails = Product & {
  ingredients: Ingredient[];
  items: ProductItem[];
};

type Props = {
  product: ProductWithDetails;
  className?: string;
};

export const ChooseProductModal: React.FC<Props> = ({ product, className }) => {
  const router = useRouter();

  return (
    <Dialog open={Boolean(product)} onOpenChange={() => router.back()}>
      <DialogContent
        className={cn(
          "flex min-h-[500px] w-[1060px] max-w-[1060px] flex-col overflow-hidden bg-white p-0 sm:max-w-[1060px]",
          className,
        )}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <ChoosePizzaForm
          imageUrl={product.imageUrl}
          name={product.name}
          ingredients={product.ingredients}
          items={product.items}
        />
      </DialogContent>
    </Dialog>
  );
};
