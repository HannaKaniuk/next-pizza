import { apiClient } from "@/services/api-client";
import type { HomeCategory } from "@/lib/get-categories-with-products";
import {
  productFiltersToSearchParams,
  type ProductFilterParams,
} from "@/lib/product-filters";

export const categoriesService = {
  getFiltered(filters: ProductFilterParams, signal?: AbortSignal) {
    return apiClient.get<HomeCategory[]>("/api/categories", {
      signal,
      params: productFiltersToSearchParams(filters),
    });
  },
};
