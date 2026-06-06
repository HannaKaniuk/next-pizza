import { apiClient } from "@/services/api-client";
import type { CartItemProps } from "@/components/shared/cart-item-details/cart-item-details.types";

export type CartResponse = {
  items: CartItemProps[];
  totalAmount: number;
};

export const cartService = {
  get() {
    return apiClient.get<CartResponse>("/api/cart");
  },

  addItem(data: {
    productItemId: number;
    quantity?: number;
    ingredientIds?: number[];
  }) {
    return apiClient.post<CartResponse>("/api/cart", data);
  },

  updateQuantity(itemId: number, quantity: number) {
    return apiClient.patch<CartResponse>(`/api/cart/${itemId}`, { quantity });
  },

  removeItem(itemId: number) {
    return apiClient.delete<CartResponse>(`/api/cart/${itemId}`);
  },
};
