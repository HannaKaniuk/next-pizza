import React from "react";
import { cn } from "@/lib/utils";
import type { HomeCategory } from "@/lib/get-categories-with-products";

type CategoryItem = Pick<HomeCategory, "id" | "name" | "anchorId">;

type Props = {
  className?: string;
  categories: CategoryItem[];
  activeCategoryId: number;
  onCategoryClick?: (categoryId: number) => void;
};

export const Categories: React.FC<Props> = ({
  className,
  categories,
  activeCategoryId,
  onCategoryClick,
}) => {
  const [localActiveCategoryId, setLocalActiveCategoryId] =
    React.useState(activeCategoryId);

  React.useEffect(() => {
    setLocalActiveCategoryId(activeCategoryId);
  }, [activeCategoryId]);

  return (
    <div
      className={cn("inline-flex gap-1 rounded-2xl bg-gray-50 p-1", className)}
    >
      {categories.map((category) => (
        <a
          href={`#${category.anchorId}`}
          className={cn(
            "flex h-11 items-center rounded-2xl px-5 font-bold",
            localActiveCategoryId === category.id &&
              "text-primary bg-white shadow-md shadow-gray-200",
          )}
          key={category.id}
          onClick={(event) => {
            event.preventDefault();
            setLocalActiveCategoryId(category.id);
            onCategoryClick?.(category.id);
          }}
        >
          {category.name}
        </a>
      ))}
    </div>
  );
};
