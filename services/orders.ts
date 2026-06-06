import { apiClient } from "@/services/api-client";

export type CreateOrderResponse = {
  orderId: number;
  message: string;
};

export const ordersService = {
  create(data?: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    comment?: string;
  }) {
    return apiClient.post<CreateOrderResponse>("/api/orders", data ?? {});
  },
};
