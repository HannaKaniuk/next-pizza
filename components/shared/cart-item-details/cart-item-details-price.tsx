import { cn } from "@/lib/utils";

type Props = {
  value: number;
  className?: string;
};

export const CartItemDetailsPrice: React.FC<Props> = ({ value, className }) => {
  return (
    <p className={cn("shrink-0 text-base font-bold whitespace-nowrap", className)}>
      {value} <span className="text-sm font-semibold">грн</span>
    </p>
  );
};
