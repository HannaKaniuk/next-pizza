"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui";
import * as CartItemDetails from "./cart-item-details";
import type { CartItemProps } from "./cart-item-details/cart-item-details.types";

type Props = CartItemProps & {
  className?: string;
  onClickCountButton?: (type: "plus" | "minus", id: number) => void;
  onRemove?: (id: number) => void;
};

export const CartItemDrawer: React.FC<Props> = ({
  id,
  imageUrl,
  details,
  disabled,
  name,
  price,
  quantity,
  onClickCountButton,
  onRemove,
  className,
}) => {
  return (
    <div
      className={cn(
        "group rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/4 transition-shadow hover:shadow-md",
        className,
        disabled && "pointer-events-none opacity-50",
      )}
    >
      <div className="flex gap-4">
        <CartItemDetails.Image src={imageUrl} alt={name} />

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <CartItemDetails.Info name={name} details={details} />
            <div className="flex shrink-0 items-start gap-1">
              <CartItemDetails.Price value={price * quantity} />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                title="Видалити"
                disabled={disabled}
                onClick={() => onRemove?.(id)}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive -mr-1 size-8 opacity-70 transition-opacity group-hover:opacity-100"
              >
                <Trash2 className="size-4" strokeWidth={2} />
              </Button>
            </div>
          </div>

          <CartItemDetails.CountButton
            value={quantity}
            disableMinusAtOne={false}
            onClick={(type) => onClickCountButton?.(type, id)}
            className="mt-4"
          />
        </div>
      </div>
    </div>
  );
};
