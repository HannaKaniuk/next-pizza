"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { apiClient } from "@/services/api-client";
import { useProductModalStore } from "@/store/product-modal";
import { ChooseProductForm } from "../choose-product-form";
import { ProductModalSkeleton } from "./product-modal-skeleton";
import type { ProductForModal } from "./product-modal.types";

type Props = {
  productId: number;
  className?: string;
};

export const ProductModalLoader: React.FC<Props> = ({
  productId,
  className,
}) => {
  const router = useRouter();
  const preview = useProductModalStore((s) => s.preview);
  const clearPreview = useProductModalStore((s) => s.clearPreview);
  const [product, setProduct] = useState<ProductForModal | null>(null);

  const previewMatches = preview?.id === productId;

  useEffect(() => {
    let cancelled = false;

    void apiClient
      .get<ProductForModal>(`/api/products/${productId}`)
      .then((data) => {
        if (!cancelled) setProduct(data);
      })
      .catch(() => {
        if (!cancelled) router.back();
      });

    return () => {
      cancelled = true;
    };
  }, [productId, router]);

  const closeModal = () => {
    clearPreview();
    router.back();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) closeModal();
  };

  const title = product?.name ?? preview?.name ?? "Товар";
  const showSkeleton = !product;
  const showPreviewForm = showSkeleton && previewMatches;

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent
        className={cn(
          "flex min-h-[500px] w-[1060px] max-w-[1060px] flex-col overflow-hidden bg-white p-0 sm:max-w-[1060px]",
          className,
        )}
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>

        {product ? (
          <ChooseProductForm
            imageUrl={product.imageUrl}
            name={product.name}
            ingredients={product.ingredients}
            items={product.items}
            onAddToCartSuccess={closeModal}
          />
        ) : showPreviewForm ? (
          <ChooseProductForm
            imageUrl={preview.imageUrl}
            name={preview.name}
            ingredients={[]}
            items={[]}
            detailsLoading
            onAddToCartSuccess={closeModal}
          />
        ) : (
          <ProductModalSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
};
