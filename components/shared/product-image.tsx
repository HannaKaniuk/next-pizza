import Image from "next/image";
import React from "react";
import { PRODUCT_FALLBACK_IMAGE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  imageUrl: string;
  alt?: string;
}

export const ProductImage: React.FC<Props> = ({
  imageUrl,
  alt = "Product",
  className,
}) => {
  const src = imageUrl || PRODUCT_FALLBACK_IMAGE_URL;

  return (
    <div
      className={cn(
        "relative flex min-h-[450px] min-w-0 flex-1 items-center justify-center",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={430}
        height={430}
        className="relative z-10 object-contain"
        priority
      />

      <div className="absolute top-1/2 left-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-gray-200" />
      <div className="absolute top-1/2 left-1/2 h-[370px] w-[370px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dotted border-gray-100" />
    </div>
  );
};
