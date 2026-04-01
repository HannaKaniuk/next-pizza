import React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { Categories } from "./categories";
import { SortPopup } from "./sort-popup";

type Props = {
  className?: string;
};

export const TopBar: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "sticky  top-0 bg-white py-5 shadow shadow-black/5 z-10",
        className
      )}
    >
      <Container className="flex justify-between items-center">
        {" "}
        <Categories />
        <SortPopup />
      </Container>
    </div>
  );
};
