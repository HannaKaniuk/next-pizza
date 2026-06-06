"use client";

import React from "react";
import { useClickAway } from "react-use";
import { cn } from "@/lib/utils";
import {
  PRODUCT_SORT_OPTIONS,
  type ProductSort,
} from "@/lib/sort-products";
import { ArrowUpDown, Check } from "lucide-react";

type Props = {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
  className?: string;
};

export const SortPopup: React.FC<Props> = ({ value, onChange, className }) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useClickAway(ref, () => setOpen(false));

  const activeLabel =
    PRODUCT_SORT_OPTIONS.find((option) => option.value === value)?.label ??
    PRODUCT_SORT_OPTIONS[0].label;

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-[52px] cursor-pointer items-center gap-1 rounded-2xl bg-gray-50 px-5 transition-colors hover:bg-gray-100"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <ArrowUpDown size={16} />
        <b>Сортування:</b>
        <b className="text-primary">{activeLabel}</b>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-full right-0 z-20 mt-2 min-w-[200px] overflow-hidden rounded-2xl border border-black/5 bg-white py-1 shadow-lg shadow-black/10"
        >
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <li key={option.value} role="option" aria-selected={value === option.value}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                <span
                  className={cn(
                    value === option.value && "font-semibold text-primary",
                  )}
                >
                  {option.label}
                </span>
                {value === option.value && (
                  <Check size={16} className="text-primary" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
