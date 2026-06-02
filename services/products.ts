import { apiClient } from "@/services/api-client";

export type SearchProduct = {
  id: number;
  name: string;
  imageUrl: string;
};

export const productsService = {
  search(query: string, signal?: AbortSignal) {
    const normalizedQuery = query.trim();

    return apiClient.get<SearchProduct[]>("/api/products/search", {
      signal,
      params: normalizedQuery ? { query: normalizedQuery } : undefined,
    });
  },
};
