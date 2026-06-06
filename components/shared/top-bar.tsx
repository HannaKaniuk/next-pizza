import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Categories } from "./categories";
import { SortPopup } from "./sort-popup";
import type { HomeCategory } from "@/lib/get-categories-with-products";
import type { ProductSort } from "@/lib/sort-products";

type CategoryItem = Pick<HomeCategory, "id" | "name" | "anchorId">;

type Props = {
  className?: string;
  categories: CategoryItem[];
  activeCategoryId: number;
  sort: ProductSort;
  onSortChange: (sort: ProductSort) => void;
  onCategoryClick?: (categoryId: number) => void;
};

export const TopBar: React.FC<Props> = ({
  className,
  categories,
  activeCategoryId,
  sort,
  onSortChange,
  onCategoryClick,
}) => {
  return (
    <div
      className={cn(
        "sticky top-0 z-10 bg-white py-5 shadow shadow-black/5",
        className,
      )}
    >
      <Container className="flex items-center justify-between">
        <Categories
          categories={categories}
          activeCategoryId={activeCategoryId}
          onCategoryClick={onCategoryClick}
        />
        <SortPopup value={sort} onChange={onSortChange} />
      </Container>
    </div>
  );
};
