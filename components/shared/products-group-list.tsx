"use client";

import React from "react";
import { useIntersection } from "react-use";
import { ProductCard } from "./product-card";
import { Title } from "./title";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  categoryId: number;
  sectionId: string;
  className?: string;
  listClassName?: string;
  onCategoryVisible?: (categoryId: number) => void;
  items: {
    id: number;
    name: string;
    imageUrl: string;
    items: { price: number }[];
  }[];
};

export const ProductsGroupList: React.FC<Props> = ({
  title,
  items,
  listClassName,
  categoryId,
  sectionId,
  className,
  onCategoryVisible,
}) => {
  const intersectionRef = React.useRef<HTMLDivElement>(null);
  const intersection = useIntersection(
    intersectionRef as React.RefObject<HTMLElement>,
    {
      threshold: 0.4,
    }
  );

  React.useEffect(() => {
    if (intersection?.isIntersecting) {
      onCategoryVisible?.(categoryId);
    }
  }, [categoryId, intersection?.isIntersecting, onCategoryVisible]);

  return (
    <div className={className} id={sectionId} ref={intersectionRef}>
      <Title text={title} size="lg" className="font-extrabold mb-5" />

      <div className={cn("grid grid-cols-3 gap-12.5", listClassName)}>
        {items.map((product, index) => (
          <ProductCard
            key={`${categoryId}-${product.id}-${index}`}
            id={product.id}
            name={product.name}
            imageUrl={product.imageUrl}
            price={product.items[0]?.price ?? 0}
          />
        ))}
      </div>
    </div>
  );
};
