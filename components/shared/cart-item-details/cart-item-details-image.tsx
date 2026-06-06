import Image from "next/image";
import { PRODUCT_FALLBACK_IMAGE_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt?: string;
  className?: string;
};

export const CartItemDetailsImage: React.FC<Props> = ({
  src,
  alt = "Product",
  className,
}) => {
  return (
    <div
      className={cn(
        "flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5",
        className,
      )}
    >
      <Image
        src={src || PRODUCT_FALLBACK_IMAGE_URL}
        alt={alt}
        width={56}
        height={56}
        className="h-14 w-14 object-contain"
      />
    </div>
  );
};
