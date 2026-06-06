"use client";

import { ChooseProductForm } from "./choose-product-form";
import type { ProductForModal } from "./modals/product-modal.types";

type Props = {
  product: ProductForModal;
};

export function ProductPageForm({ product }: Props) {
  return (
    <ChooseProductForm
      imageUrl={product.imageUrl}
      name={product.name}
      ingredients={product.ingredients}
      items={product.items}
    />
  );
}
