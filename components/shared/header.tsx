import { cn } from "@/lib/utils";
import React from "react";
import { Container } from "./container";
import Image from "next/image";
import { Button } from "../ui";
import { User } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { ArrowRight } from "lucide-react";

type Props = {
  className?: string;
};

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn("border border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-black uppercase">Croissants</h1>
            <p className="text-sm leading-3 text-gray-400">смачніше нікуди</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-1">
            <User size={16} /> Увійти
          </Button>
          <div>
            <Button className="group relative">
              <b>520 грн</b>
              <span className="mx-3 h-full w-[1px] bg-white/30"></span>
              <div className="flex items-center gap-1 transition duration-300 group-hover:opacity-0">
                <ShoppingCart className="relative h-4 w-4" strokeWidth={2} />
                <b>3</b>
              </div>
              <ArrowRight className="absolute right-5 w-5 -translate-x-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
};
