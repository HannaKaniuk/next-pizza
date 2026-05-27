"use client";

import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useClickAway, useDebounce } from "react-use";

type SearchProduct = {
  id: number;
  name: string;
  imageUrl: string;
};

interface Props {
  className?: string;
}

export const SearchInput: React.FC<Props> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [products, setProducts] = React.useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  useClickAway(ref, () => {
    setFocused(false);
  });

  useDebounce(
    async () => {
      const query = searchQuery.trim();

      if (!query) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/products/search?query=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
          throw new Error("Search request failed");
        }

        const data = (await response.json()) as SearchProduct[];
        setProducts(data);
      } catch (error) {
        console.error(error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    },
    250,
    [searchQuery],
  );

  const onClickItem = () => {
    setFocused(false);
    setSearchQuery("");
    setProducts([]);
  };

  const showDropdown = focused && searchQuery.trim().length > 0;

  return (
    <>
      {focused && (
        <div className="fixed inset-0 z-30 bg-black/50" />
      )}

      <div
        ref={ref}
        className={cn(
          "relative z-30 flex h-11 flex-1 justify-between rounded-2xl",
          className,
        )}
      >
        <Search className="absolute top-1/2 left-3 h-5 translate-y-[-50%] text-gray-400" />
        <input
          className="w-full rounded-2xl bg-gray-100 pl-11 outline-none"
          type="text"
          placeholder="Пошук..."
          onFocus={() => setFocused(true)}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {showDropdown && (
          <div
            className={cn(
              "invisible absolute top-14 z-30 w-full rounded-xl bg-white py-2 opacity-0 shadow-md transition-all duration-200",
              focused && "visible top-12 opacity-100",
            )}
          >
            {isLoading && (
              <p className="px-3 py-2 text-sm text-gray-400">Завантаження...</p>
            )}

            {!isLoading && products.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-400">Нічого не знайдено</p>
            )}

            {!isLoading &&
              products.map((product) => (
                <Link
                  onClick={onClickItem}
                  key={product.id}
                  className="hover:bg-primary/10 flex w-full items-center gap-3 px-3 py-2"
                  href={`/product/${product.id}`}
                >
                  <Image
                    className="h-8 w-8 rounded-sm object-cover"
                    src={product.imageUrl}
                    alt={product.name}
                    width={32}
                    height={32}
                  />
                  <span>{product.name}</span>
                </Link>
              ))}
          </div>
        )}
      </div>
    </>
  );
};
