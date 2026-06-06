"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart";

function CartSessionSync() {
  const { status } = useSession();
  const fetchCart = useCartStore((state) => state.fetchCart);

  useEffect(() => {
    if (status !== "loading") {
      void fetchCart();
    }
  }, [status, fetchCart]);

  return null;
}

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <CartSessionSync />
      {children}
    </SessionProvider>
  );
};
