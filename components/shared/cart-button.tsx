"use client";

import React, { useMemo } from "react";
import { Button } from "../ui";
import { ShoppingCart } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartDrawer } from "./cart-drawer";
import {
  getCartTotalsFromItems,
  useCartStore,
} from "@/store/cart";

type Props = {
  className?: string;
};

export const CartButton: React.FC<Props> = ({ className }) => {
  const items = useCartStore((state) => state.items);
  const loading = useCartStore((state) => state.loading && items.length === 0);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const checkout = useCartStore((state) => state.checkout);

  const { totalAmount, totalCount } = useMemo(
    () => getCartTotalsFromItems(items),
    [items],
  );

  return (
    <CartDrawer
      items={items}
      loading={loading}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeItem}
      onCheckout={checkout}
    >
      <Button className={cn("group relative", className)} disabled={loading}>
        <b>{totalAmount} грн</b>
        <span className="mx-3 h-full w-[1px] bg-white/30"></span>
        <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
          <ShoppingCart className="relative h-4 w-4" strokeWidth={2} />
          <b>{totalCount}</b>
        </div>
        <ArrowRight className="absolute right-5 w-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
      </Button>
    </CartDrawer>
  );
};
