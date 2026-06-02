import { apiClient } from "@/services/api-client";

export type Ingredient = {
  id: number;
  name: string;
};

export const ingredientsService = {
  getAll(signal?: AbortSignal) {
    return apiClient.get<Ingredient[]>("/api/ingredients", { signal });
  },
};
