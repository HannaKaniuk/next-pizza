"use client";

import React from "react";
import { Title } from "./title";
import { FilterCheckbox } from "./filter-checkbox";
import { Input } from "../ui";
import { RangeSlider } from "../ui/range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";
import type { FilterChecboxProps } from "./filter-checkbox";
import { useFilterIngredients } from "@/hooks/useFilterIngredients";
import {
  DEFAULT_PRODUCT_FILTERS,
  PRICE_FILTER_MAX,
  type ProductFilterParams,
} from "@/lib/product-filters";

type Props = {
  className?: string;
  ingredients: FilterChecboxProps[];
  onChange: (filters: ProductFilterParams) => void;
};

const PIZZA_TYPE_OPTIONS = [
  { text: "Можна збирати", value: "1" },
  { text: "Новинки", value: "2" },
] as const;

export const Filters: React.FC<Props> = ({
  className,
  ingredients,
  onChange,
}) => {
  const limit = 6;
  const [pizzaTypes, setPizzaTypes] = React.useState<string[]>([]);
  const [ingredientIds, setIngredientIds] = React.useState<string[]>([]);
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    DEFAULT_PRODUCT_FILTERS.priceFrom,
    DEFAULT_PRODUCT_FILTERS.priceTo,
  ]);

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

  const emitFilters = React.useCallback(
    (
      nextPizzaTypes: string[],
      nextIngredientIds: string[],
      nextPriceRange: [number, number],
    ) => {
      onChange({
        pizzaTypes: nextPizzaTypes.map(Number).filter((value) => value > 0),
        ingredientIds: nextIngredientIds
          .map(Number)
          .filter((value) => value > 0),
        priceFrom: nextPriceRange[0],
        priceTo: nextPriceRange[1],
      });
    },
    [onChange],
  );

  const togglePizzaType = (value: string) => {
    const next = pizzaTypes.includes(value)
      ? pizzaTypes.filter((item) => item !== value)
      : [...pizzaTypes, value];
    setPizzaTypes(next);
    emitFilters(next, ingredientIds, priceRange);
  };

  const handleIngredientsChange = React.useCallback(
    (values: string[]) => {
      setIngredientIds(values);
      emitFilters(pizzaTypes, values, priceRange);
    },
    [emitFilters, pizzaTypes, priceRange],
  );

  const handlePriceRangeChange = React.useCallback(
    (values: number[]) => {
      const nextRange: [number, number] = [
        values[0] ?? 0,
        values[1] ?? PRICE_FILTER_MAX,
      ];

      if (
        priceRange[0] === nextRange[0] &&
        priceRange[1] === nextRange[1]
      ) {
        return;
      }

      setPriceRange(nextRange);
      emitFilters(pizzaTypes, ingredientIds, nextRange);
    },
    [emitFilters, pizzaTypes, ingredientIds, priceRange],
  );

  const handlePriceInputChange = (index: 0 | 1, rawValue: string) => {
    const parsed = Number(rawValue);
    const value = Number.isFinite(parsed)
      ? Math.min(Math.max(parsed, 0), PRICE_FILTER_MAX)
      : index === 0
        ? 0
        : PRICE_FILTER_MAX;

    const nextRange: [number, number] =
      index === 0 ? [value, priceRange[1]] : [priceRange[0], value];
    setPriceRange(nextRange);
    emitFilters(pizzaTypes, ingredientIds, nextRange);
  };

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
        {PIZZA_TYPE_OPTIONS.map((option) => (
          <FilterCheckbox
            key={option.value}
            idPrefix="pizza-type"
            text={option.text}
            value={option.value}
            checked={pizzaTypes.includes(option.value)}
            onCheckedChange={() => togglePizzaType(option.value)}
          />
        ))}
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/70 bg-white/55 px-4 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <p className="mb-3 font-bold">Ціна від і до:</p>
        <div className="mb-5 flex gap-3">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={PRICE_FILTER_MAX}
            value={priceRange[0]}
            onChange={(event) =>
              handlePriceInputChange(0, event.target.value)
            }
          />
          <Input
            type="number"
            min={0}
            max={PRICE_FILTER_MAX}
            placeholder={String(PRICE_FILTER_MAX)}
            value={priceRange[1]}
            onChange={(event) =>
              handlePriceInputChange(1, event.target.value)
            }
          />
        </div>
        <RangeSlider
          min={0}
          max={PRICE_FILTER_MAX}
          step={10}
          value={priceRange}
          onValueChange={handlePriceRangeChange}
        />
      </div>

      {items.length > 0 && (
        <CheckboxFiltersGroup
          className="relative mt-5 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
          title="Інгрідієнти"
          limit={limit}
          idPrefix="ingredients"
          defaultItems={defaultItems}
          items={items}
          showAll={showAll}
          onShowAllChange={setShowAll}
          isLoading={isIngredientsLoading}
          onChange={handleIngredientsChange}
        />
      )}
    </div>
  );
};
