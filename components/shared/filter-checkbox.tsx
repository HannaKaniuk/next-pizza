import React from "react";
import { Checkbox } from "../ui/checkbox";

export type FilterChecboxProps = {
  text: string;
  value: string;
  idPrefix?: string;
  endAdornment?: React.ReactNode;
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
};

export const FilterCheckbox: React.FC<FilterChecboxProps> = ({
  text,
  value,
  idPrefix = "filter",
  endAdornment,
  onCheckedChange,
  checked,
}) => {
  const checkboxId = `${idPrefix}-checkbox-${String(value)}`;

  return (
    <div className="group flex items-center space-x-2 rounded-xl px-2 py-1.5 transition-colors hover:bg-white/70">
      <Checkbox
        onCheckedChange={onCheckedChange}
        checked={checked}
        value={value}
        className="h-6 w-6 rounded-[8px] border-neutral-300/90 bg-white/90 transition-all group-hover:border-primary/50 "
        id={checkboxId}
      />
      <label
        htmlFor={checkboxId}
        className="flex-1 cursor-pointer leading-none transition-colors group-hover:text-neutral-900"
      >
        {text}
      </label>
      {endAdornment}
    </div>
  );
};
