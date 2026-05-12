import React from "react";
import Link from "next/link";
import { Title } from "./title";
import { Button } from "../ui";
import { Plus } from "lucide-react";
import Image from "next/image";

type Props = {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  className?: string;
};

const fallbackImageUrl =
  "https://i.pinimg.com/1200x/87/5b/82/875b82303a4108c6a2500fe7518d6ec4.jpg";

export const ProductCard: React.FC<Props> = ({
  id,
  name,
  price,
  imageUrl,
  className,
}) => {
  return (
    <div className={className}>
      <Link href={`/product/${id}`}>
        <div className="flex h-[260px] justify-center rounded-lg">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              width={260}
              height={260}
              className="h-full w-full rounded-md object-cover"
            />
          ) : (
            <Image
              src={fallbackImageUrl}
              alt="Зображення піци"
              width={260}
              height={260}
              className="h-full w-full rounded-md object-cover"
            />
          )}
        </div>

        <Title text={name} size="sm" className="mt-3 mb-1 font-bold" />

        <p className="text-sm text-gray-400"></p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[20px]">
            від <b>{price} грн</b>
          </span>

          <Button variant="secondary" className="text-base font-bold">
            <Plus size={20} className="mr-1" />
            Додати
          </Button>
        </div>
      </Link>
    </div>
  );
};
