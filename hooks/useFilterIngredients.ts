"use client";

import React from "react";
import type { FilterChecboxProps } from "@/components/shared/filter-checkbox";
import { ingredientsService } from "@/services";

type UseFilterIngredientsParams = {
  initialItems: FilterChecboxProps[];
  limit: number;
};

export const useFilterIngredients = ({
  initialItems,
  limit,
}: UseFilterIngredientsParams) => {
  const [items, setItems] = React.useState(initialItems);
  const [showAll, setShowAll] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasLoadedAll, setHasLoadedAll] = React.useState(false);

  React.useEffect(() => {
    setItems(initialItems);
    setHasLoadedAll(false);
  }, [initialItems]);

  React.useEffect(() => {
    if (!showAll || hasLoadedAll) {
      return;
    }

    const abortController = new AbortController();

    const loadIngredients = async () => {
      setIsLoading(true);
      try {
        const ingredients = await ingredientsService.getAll(
          abortController.signal,
        );
        const mappedItems = ingredients.map((ingredient) => ({
          text: ingredient.name,
          value: String(ingredient.id),
        }));
        setItems(mappedItems);
        setHasLoadedAll(true);
      } catch {
        // Keep initial ingredients if request fails.
      } finally {
        setIsLoading(false);
      }
    };

    void loadIngredients();

    return () => {
      abortController.abort();
    };
  }, [hasLoadedAll, showAll]);

  return {
    items,
    showAll,
    isLoading,
    setShowAll,
    defaultItems: items.slice(0, limit),
  };
};
