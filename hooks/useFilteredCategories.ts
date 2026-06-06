"use client";

import React from "react";
import { useDebounce } from "react-use";

import type { HomeCategory } from "@/lib/get-categories-with-products";
import {
  hasActiveProductFilters,
  type ProductFilterParams,
} from "@/lib/product-filters";
import { categoriesService } from "@/services/categories";

type Params = {
  initialCategories: HomeCategory[];
  filters: ProductFilterParams;
};

export const useFilteredCategories = ({
  initialCategories,
  filters,
}: Params) => {
  const [categories, setCategories] =
    React.useState<HomeCategory[]>(initialCategories);
  const [isLoading, setIsLoading] = React.useState(false);
  const requestIdRef = React.useRef(0);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    setCategories(initialCategories);
  }, [initialCategories]);

  React.useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  useDebounce(
    async () => {
      if (!hasActiveProductFilters(filters)) {
        setCategories(initialCategories);
        setIsLoading(false);
        return;
      }

      const requestId = ++requestIdRef.current;

      try {
        abortControllerRef.current?.abort();
        const controller = new AbortController();
        abortControllerRef.current = controller;

        setIsLoading(true);
        const data = await categoriesService.getFiltered(
          filters,
          controller.signal,
        );

        if (requestId === requestIdRef.current) {
          setCategories(data);
        }
      } catch (error) {
        if (
          requestId === requestIdRef.current &&
          !(error instanceof DOMException && error.name === "AbortError")
        ) {
          setCategories([]);
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false);
        }
      }
    },
    300,
    [filters, initialCategories],
  );

  return { categories, isLoading };
};
