import React from "react";
import { cn } from "@/lib/utils";

export const categories = [
  { id: 1, name: "КРУАСАНИ СЕНДВІЧІ", anchorId: "category-1" },
  { id: 2, name: "СОЛОДКІ КРУАСАНИ", anchorId: "category-2" },
] as const;

type Props = {
  className?: string;
  activeCategoryId: number;
  onCategoryClick?: (categoryId: number) => void;
};

export const Categories: React.FC<Props> = ({
  className,
  activeCategoryId,
  onCategoryClick,
}) => {
  return (
    <div
      className={cn("inline-flex gap-1 rounded-2xl bg-gray-50 p-1", className)}
    >
      {categories.map((category) => (
        <a
          href={`#${category.anchorId}`}
          className={cn(
            "flex h-11 items-center rounded-2xl px-5 font-bold",
            activeCategoryId === category.id &&
              "text-primary bg-white shadow-md shadow-gray-200",
          )}
          key={category.id}
          onClick={() => onCategoryClick?.(category.id)}
        >
          <button>{category.name}</button>
        </a>
      ))}
    </div>
  );
};
