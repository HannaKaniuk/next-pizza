"use client";

import React from "react";
import { Container } from "./container";
import { TopBar } from "./top-bar";
import { Title } from "./title";
import { Filters } from "./filters";
import { ProductsGroupList } from "@/components/shared/products-group-list";
import { useCategoryStore } from "@/store/category";
import type { HomeCategory } from "@/lib/get-categories-with-products";
import type { FilterChecboxProps } from "./filter-checkbox";

type Props = {
  categories: HomeCategory[];
  ingredients: FilterChecboxProps[];
};

export const Home: React.FC<Props> = ({ categories, ingredients }) => {
  const activeCategoryId = useCategoryStore((state) => state.activeId);
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);

  const initialCategoryId = categories[0]?.id ?? 1;

  React.useEffect(() => {
    setActiveCategoryId(initialCategoryId);
  }, [initialCategoryId, setActiveCategoryId]);

  const totalProducts = categories.reduce(
    (sum, category) => sum + category.products.length,
    0,
  );

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategoryId(categoryId);

    const sectionElement = document.getElementById(`category-${categoryId}`);
    if (!sectionElement) return;

    sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Container className="mt-10">
        <Title text="Всі піцци" size="lg" className="font-extrabold" />
      </Container>

      <TopBar
        categories={categories}
        activeCategoryId={activeCategoryId}
        onCategoryClick={handleCategoryClick}
      />

      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          <div className="w-[300px]">
            <Filters ingredients={ingredients} />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              {categories.map((category) => (
                <ProductsGroupList
                  key={category.id}
                  title={category.name}
                  categoryId={category.id}
                  sectionId={category.anchorId}
                  onCategoryVisible={setActiveCategoryId}
                  items={category.products.map((product) => ({
                    id: product.id,
                    name: product.name,
                    imageUrl: product.imageUrl,
                    items: [{ price: product.price }],
                  }))}
                />
              ))}
            </div>
            {totalProducts > 0 && (
              <div className="mt-12 flex items-center gap-6">
                <span className="text-sm text-gray-400">
                  {totalProducts} товарів
                </span>
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  );
};
