import React from "react";
import { Title } from "./title";
import { FilterCheckbox } from "./filter-checkbox";
import { Input } from "../ui";
import { RangeSlider } from "../ui/range-slider";
import { CheckboxFiltersGroup } from "./checkbox-filters-group";

type Props = {
  className?: string;
};

export const Filters: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={`relative overflow-hidden rounded-md border p-5  shadow-2xs ring-1 ring-black/5 backdrop-blur-2xl ${
        className ?? ""
      }`}
    >
      <div className="pointer-events-none absolute -left-12 -top-12 h-36 w-36 rounded-full bg-white/55 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />

      <Title
        text="Фільтрація"
        size="sm"
        className="relative z-10 mb-5 font-bold text-black"
      />

      <div className="relative flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <FilterCheckbox text="Можна збирати" value="1" />
        <FilterCheckbox text="Новинки" value="2" />
      </div>

      <div className="relative mt-5 rounded-2xl border border-white/70 bg-white/55 px-4 py-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
        <p className="font-bold mb-3">Ціна від і до:</p>
        <div className="flex gap-3 mb-5">
          <Input
            type="number"
            placeholder="0"
            min={0}
            max={1000}
            defaultValue={0}
          />
          <Input type="number" min={100} max={1000} placeholder="1000" />
        </div>
        <RangeSlider min={0} max={700} step={10} value={[0, 700]} />
      </div>
      <CheckboxFiltersGroup
        className="relative mt-5 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
        title="Інгрідієнти"
        limit={6}
        defaultItems={[
          {
            text: "Сирний соус",
            value: "1",
          },
          {
            text: "Моццарелла",
            value: "2",
          },
          {
            text: "Часник",
            value: "3",
          },
          {
            text: "Солоні огірки",
            value: "4",
          },
          {
            text: "Червоний лук",
            value: "5",
          },
          {
            text: "Томати",
            value: "6",
          },
        ]}
        items={[
          {
            text: "Сирний соус",
            value: "1",
          },
          {
            text: "Моццарелла",
            value: "2",
          },
          {
            text: "Часник",
            value: "3",
          },
          {
            text: "Солоні огірки",
            value: "4",
          },
          {
            text: "Червоний лук",
            value: "5",
          },
          {
            text: "Томати",
            value: "6",
          },
          {
            text: "Сирний соус",
            value: "7",
          },
          {
            text: "Моццарелла",
            value: "8",
          },
          {
            text: "Часник",
            value: "9",
          },
          {
            text: "Солоні огірки",
            value: "10",
          },
          {
            text: "Червоний лук",
            value: "11",
          },
          {
            text: "Томати",
            value: "12",
          },
        ]}
      />
    </div>
  );
};
