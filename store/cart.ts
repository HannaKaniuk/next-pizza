import { create } from "zustand";
import type { CartItemProps } from "@/components/shared/cart-item-details/cart-item-details.types";
import { cartService } from "@/services/cart";
import { ordersService } from "@/services/orders";

type State = {
  items: CartItemProps[];
  totalAmount: number;
  loading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (data: {
    productItemId: number;
    quantity?: number;
    ingredientIds?: number[];
  }) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  checkout: () => Promise<string>;
};

function totalsFromItems(items: CartItemProps[]) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  return { items, totalAmount };
}

export const useCartStore = create<State>((set, get) => ({
  items: [],
  totalAmount: 0,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const data = await cartService.get();
      set({ items: data.items, totalAmount: data.totalAmount });
    } finally {
      set({ loading: false });
    }
  },

  addItem: async (data) => {
    try {
      const response = await cartService.addItem(data);
      set({ items: response.items, totalAmount: response.totalAmount });
    } catch {
      throw new Error("Не вдалося додати до кошика");
    }
  },

  updateQuantity: async (itemId, quantity) => {
    const snapshot = get();
    const optimistic = totalsFromItems(
      snapshot.items.map((item) =>
        item.id === itemId ? { ...item, quantity } : item,
      ),
    );
    set(optimistic);

    try {
      const response = await cartService.updateQuantity(itemId, quantity);
      set({ items: response.items, totalAmount: response.totalAmount });
    } catch {
      set({
        items: snapshot.items,
        totalAmount: snapshot.totalAmount,
      });
      throw new Error("Не вдалося оновити кількість");
    }
  },

  removeItem: async (itemId) => {
    const snapshot = get();
    const optimistic = totalsFromItems(
      snapshot.items.filter((item) => item.id !== itemId),
    );
    set(optimistic);

    try {
      const response = await cartService.removeItem(itemId);
      set({ items: response.items, totalAmount: response.totalAmount });
    } catch {
      set({
        items: snapshot.items,
        totalAmount: snapshot.totalAmount,
      });
      throw new Error("Не вдалося видалити товар");
    }
  },

  checkout: async () => {
    set({ loading: true });
    try {
      const { message } = await ordersService.create();
      set({ items: [], totalAmount: 0 });
      return message;
    } finally {
      set({ loading: false });
    }
  },
}));

export function getCartTotalsFromItems(items: CartItemProps[]) {
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { totalAmount, totalCount };
}
