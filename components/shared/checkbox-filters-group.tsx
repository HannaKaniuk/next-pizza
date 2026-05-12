"use client";

import React from "react";
import { useSet } from "react-use";

import { FilterCheckbox, FilterChecboxProps } from "./filter-checkbox";
import { Input } from "../ui/input";

type Item = FilterChecboxProps;

type Props = {
  title: string;
  items: Item[];
  defaultItems?: Item[];
  limit?: number;
  searchInputPlaceholder?: string;
  className?: string;
  onChange?: (values: string[]) => void;
  defaultValue?: string[];
};

export const CheckboxFiltersGroup: React.FC<Props> = ({
  title,
  items,
  defaultItems,
  limit = 5,
  searchInputPlaceholder = "Пошук...",
  className,
  onChange,
  defaultValue,
}) => {
  const [showAll, setShowAll] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [selected, { add, toggle }] = useSet<string>(new Set([]));

  const onChangeSearchInput = (value: string) => {
    setSearchValue(value);
  };
  const onCheckedChange = (value: string) => {
    toggle(value);
  };

  const baseList = defaultItems?.length ? defaultItems : items;
  const list = showAll
    ? baseList.filter((item) =>
        item.text.toLowerCase().includes(searchValue.toLowerCase())
      )
    : baseList.slice(0, limit);

  React.useEffect(() => {
    if (defaultValue) {
      defaultValue.forEach(add);
    }
  }, [defaultValue?.length]);

  React.useEffect(() => {
    onChange?.(Array.from(selected));
  }, [selected]);

  return (
    <div className={className}>
      <p className="font-bold mb-3">{title}</p>

      {showAll && (
        <div className="mb-5">
          <Input
            onChange={(e) => onChangeSearchInput(e.target.value)}
            placeholder={searchInputPlaceholder}
            className="border-white/70 bg-white/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
          />
        </div>
      )}

      <div className="flex flex-col gap-4 max-h-96 pr-2 overflow-auto scrollbar">
        {list.map((item) => (
          <FilterCheckbox
            onCheckedChange={() => onCheckedChange(item.value)}
            checked={selected.has(item.value)}
            key={String(item.value)}
            value={item.value}
            text={item.text}
            endAdornment={item.endAdornment}
          />
        ))}
      </div>

      {items.length > limit && (
        <div className={showAll ? "mt-4 border-t border-t-white/60 pt-2" : ""}>
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-3 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2 text-primary transition-all hover:border-primary/35 hover:bg-primary/15 "
          >
            {showAll ? "Скрити" : "+ Показати все"}
          </button>
        </div>
      )}
    </div>
  );
};
