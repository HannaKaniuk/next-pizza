"use client";

import React, { useMemo, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "../ui";
import { ArrowRight, CheckCircle2, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { CartItemDrawer } from "./cart-item-drawer";
import { CartEmptyState } from "./cart-empty-state";
import { getCartTotalsFromItems } from "@/store/cart";
import type { CartItemProps } from "./cart-item-details/cart-item-details.types";

type Props = {
  className?: string;
  items: CartItemProps[];
  loading?: boolean;
  onUpdateQuantity: (itemId: number, quantity: number) => Promise<void>;
  onRemoveItem: (itemId: number) => Promise<void>;
  onCheckout: () => Promise<string>;
};

function formatItemsCount(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod100 >= 11 && mod100 <= 14) return `${count} товарів`;
  if (mod10 === 1) return `${count} товар`;
  if (mod10 >= 2 && mod10 <= 4) return `${count} товари`;

  return `${count} товарів`;
}

export const CartDrawer: React.FC<React.PropsWithChildren<Props>> = ({
  className,
  children,
  items,
  loading,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { totalAmount, totalCount } = useMemo(
    () => getCartTotalsFromItems(items),
    [items],
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOrderPlaced(false);
      setSuccessMessage("");
      setCheckoutError(null);
    }
  };

  const handleCheckout = async () => {
    setCheckoutError(null);
    setSubmitting(true);

    try {
      const message = await onCheckout();
      setSuccessMessage(message);
      setOrderPlaced(true);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Не вдалося оформити замовлення",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onClickCountButton = async (type: "plus" | "minus", id: number) => {
    const item = items.find((entry) => entry.id === id);
    if (!item) return;

    if (type === "plus") {
      await onUpdateQuantity(id, item.quantity + 1);
      return;
    }

    if (item.quantity <= 1) {
      await onRemoveItem(id);
      return;
    }

    await onUpdateQuantity(id, item.quantity - 1);
  };

  return (
    <Sheet onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent
        className={cn(
          "flex h-full w-full flex-col gap-0 bg-[#F4F1EE] p-0 sm:max-w-[420px]",
          className,
        )}
      >
        <SheetHeader className="shrink-0 border-b border-black/5 px-6 py-5">
          <SheetTitle className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
            <ShoppingBag className="text-primary h-5 w-5" strokeWidth={2.5} />
            {items.length === 0 ? (
              "Кошик"
            ) : (
              <>
                В кошику{" "}
                <span className="text-primary">
                  {formatItemsCount(totalCount)}
                </span>
              </>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {orderPlaced ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 text-center">
              <div className="bg-primary/10 mb-6 flex size-20 items-center justify-center rounded-full">
                <CheckCircle2 className="text-primary size-10" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">
                {successMessage || "Дякуємо за покупку!"}
              </h3>
              <p className="text-muted-foreground mt-2 max-w-[260px] text-sm leading-relaxed">
                Замовлення прийнято. Скоро з вами зв&apos;яжемось для
                підтвердження.
              </p>
              <SheetClose asChild>
                <Button
                  asChild
                  className="mt-8 h-11 rounded-xl px-8 text-sm font-bold"
                >
                  <Link href="/">На головну</Link>
                </Button>
              </SheetClose>
            </div>
          ) : items.length === 0 && !loading ? (
            <CartEmptyState className="flex-1" />
          ) : (
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {items.map((item) => (
                <CartItemDrawer
                  key={item.id}
                  {...item}
                  disabled={loading || submitting}
                  onClickCountButton={onClickCountButton}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </div>

        {!orderPlaced && (
          <SheetFooter
            className={cn(
              "shrink-0 border-t border-black/5 bg-white px-6 py-5 shadow-[0_-12px_40px_rgba(0,0,0,0.06)]",
              items.length === 0 && "opacity-60",
            )}
          >
            <div className="w-full space-y-4">
              <div className="flex items-end gap-3">
                <span className="pb-0.5 text-base text-muted-foreground">
                  Всього
                </span>
                <div className="mb-1.5 min-w-0 flex-1 border-b border-dashed border-neutral-300" />
                <span className="text-2xl font-extrabold tracking-tight">
                  {totalAmount}{" "}
                  <span className="text-lg font-bold">грн</span>
                </span>
              </div>

              {checkoutError && (
                <p className="text-destructive text-center text-sm">
                  {checkoutError}
                </p>
              )}

              <Button
                type="button"
                className="h-12 w-full rounded-xl text-base font-bold"
                disabled={items.length === 0 || loading || submitting}
                onClick={handleCheckout}
              >
                {submitting ? "Оформлюємо…" : "Оформити замовлення"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};
