import React from "react";
import { Title } from "./title";
import { FilterCheckbox } from "./filter-checkbox";
import { Input } from "../ui";
import { RangeSlider } from "../ui/range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import type { FilterChecboxProps } from "./filter-checkbox";
import { useFilterIngredients } from "@/hooks/useFilterIngredients";

type Props = {
  className?: string;
  ingredients: FilterChecboxProps[];
};

export const Filters: React.FC<Props> = ({ className, ingredients }) => {
  const limit = 6;
  const {
    items,
    defaultItems,
    showAll,
    setShowAll,
    isLoading: isIngredientsLoading,
  } = useFilterIngredients({
    initialItems: ingredients,
    limit,
  });

  return (
    <div
      className={`relative overflow-hidden rounded-md border p-5 shadow-2xs ring-1 ring-black/5 backdrop-blur-2xl ${
        className ?? ""
      }`}
    >
      <div className="pointer-events-none absolute -top-12 -left-12 h-36 w-36 rounded-full bg-white/55 blur-2xl" />
      <div className="pointer-events-none absolute -right-16 -bottom-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

      <Title
        text="Фільтрація"
        size="sm"
        className="relative z-10 mb-5 font-bold text-black"
      />

      <div className="relative flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <FilterCheckbox text="Можна збирати" value="1" />
        <FilterCheckbox text="Новинки" value="2" />
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/70 bg-white/55 px-4 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <p className="mb-3 font-bold">Ціна від і до:</p>
        <div className="mb-5 flex gap-3">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            defaultValue={0}
          />
          <Input type="number" min={100} max={1000} placeholder="1000" />
        </div>
        <RangeSlider min={0} max={700} step={10} value={[0, 700]} />
      </div>

      {items.length > 0 && (
        <CheckboxFiltersGroup
          className="relative mt-5 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
          title="Інгрідієнти"
          limit={limit}
          defaultItems={defaultItems}
          items={items}
          showAll={showAll}
          onShowAllChange={setShowAll}
          isLoading={isIngredientsLoading}
        />
      )}
    </div>
  );
};
