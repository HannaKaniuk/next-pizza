"use client";

import React from "react";
import Link from "next/link";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type Props = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
  priority?: boolean;
};

const fallbackImageUrl =
  "https://i.pinimg.com/1200x/87/5b/82/875b82303a4108c6a2500fe7518d6ec4.jpg";

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  className,
  priority = false,
}) => {
  const src = imageUrl || fallbackImageUrl;

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <Link
        href={`/product/${id}`}
        className="flex h-full flex-col"
        onClick={() => {
          console.log("[card] navigate to product", { id, name });
        }}
      >
        <div className="relative h-[260px] w-full shrink-0 overflow-hidden rounded-lg">
          <Image
            src={src}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 1200px) 33vw, 320px"
            className="object-contain"
          />
        </div>

        <div className="mt-3 flex flex-1 flex-col">
          <Title
            text={name}
            size="sm"
            className="line-clamp-2 min-h-14 leading-snug font-bold"
          />

          <div className="mt-auto flex items-center justify-between gap-3 pt-4">
            <span className="text-[20px] whitespace-nowrap">
              від <b>{price} грн</b>
            </span>

            <Button
              variant="secondary"
              className="shrink-0 text-base font-bold"
            >
              <Plus size={20} className="mr-1" />
              Додати
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};
