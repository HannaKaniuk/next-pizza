"use client";

import React from "react";
import { Container, TopBar } from "@/components/shared";
import { Title } from "@/components/shared";
import { Filters } from "@/components/shared";
import { categories } from "@/components/shared/categories";
import { ProductsGroupList } from "@/components/shared/products-group-list";
import { useCategoryStore } from "@/store/category";

export default function Home() {
  const activeCategoryId = useCategoryStore((state) => state.activeId);
  const setActiveCategoryId = useCategoryStore((state) => state.setActiveId);
  const breakfastImageUrl =
    "https://i.pinimg.com/736x/68/4e/17/684e179cf30d0b891742ce4abd4ab0c7.jpg";

  const getSectionIdByCategory = (categoryId: number) =>
    categories.find((category) => category.id === categoryId)?.anchorId;

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategoryId(categoryId);

    const sectionId = getSectionIdByCategory(categoryId);
    if (!sectionId) return;

    const sectionElement = document.getElementById(sectionId);
    if (!sectionElement) return;

    sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <Container className="mt-10">
        <Title text="Всі піцци" size="lg" className="font-extrabold" />
      </Container>

      <TopBar
        activeCategoryId={activeCategoryId}
        onCategoryClick={handleCategoryClick}
      />
      <Container className="mt-10 pb-14">
        <div className="flex gap-[80px]">
          <div className="w-[300px]">
            <Filters />
          </div>
          <div className="flex-1">
            <div className="flex flex-col gap-16">
              <ProductsGroupList
                title="КРУАСАНИ СЕНДВІЧІ"
                categoryId={1}
                sectionId="category-1"
                onCategoryVisible={setActiveCategoryId}
                items={[
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "З лососем та каперсами",
                    imageUrl: "",
                    items: [{ price: 300 }],
                  },
                ]}
              />
              <ProductsGroupList
                title="СОЛОДКІ КРУАСАНИ"
                categoryId={2}
                sectionId="category-2"
                onCategoryVisible={setActiveCategoryId}
                items={[
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                  {
                    id: 1,
                    name: "Тост з яйцем",
                    imageUrl: breakfastImageUrl,
                    items: [{ price: 300 }],
                  },
                ]}
              />
            </div>

            <div className="mt-12 flex items-center gap-6">
              {/* <Pagination pageCount={3} /> */}
              <span className="text-sm text-gray-400">5 iз 65</span>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
