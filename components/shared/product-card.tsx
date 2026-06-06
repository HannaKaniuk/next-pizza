"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import Image from "next/image";
import { PRODUCT_FALLBACK_IMAGE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useProductModalStore } from "@/store/product-modal";
import { apiClient } from "@/services/api-client";
import type { ProductForModal } from "./modals/product-modal.types";

type Props = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
  priority?: boolean;
};

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  className,
  priority = false,
}) => {
  const router = useRouter();
  const setPreview = useProductModalStore((s) => s.setPreview);
  const src = imageUrl || PRODUCT_FALLBACK_IMAGE_URL;
  const productHref = `/product/${id}`;

  const prefetchProduct = () => {
    router.prefetch(productHref);
    void apiClient.get<ProductForModal>(`/api/products/${id}`).catch(() => {});
  };

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <Link
        href={productHref}
        className="flex h-full flex-col"
        onMouseEnter={prefetchProduct}
        onClick={() => setPreview({ id, name, imageUrl })}
      >
        <div className="relative h-[260px] w-full shrink-0 overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 1200px) 33vw, 320px"
            className="object-contain"
          />
        </div>

        <div className="mt-3 flex flex-1 flex-col">
          <Title
            text={name}
            size="sm"
            className="line-clamp-2 min-h-14 leading-snug font-bold"
          />

          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="text-[20px] whitespace-nowrap">
              від <b>{price} грн</b>
            </span>

            <Button
              variant="secondary"
              className="shrink-0 text-base font-bold"
            >
              <Plus size={20} className="mr-1" />
              Додати
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
