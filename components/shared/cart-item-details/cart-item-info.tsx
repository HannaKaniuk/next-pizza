import { cn } from "@/lib/utils";

type Props = {
  name: string;
  details: string;
  className?: string;
};

export const CartItemInfo: React.FC<Props> = ({ name, details, className }) => {
  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <h2 className="line-clamp-2 text-[15px] leading-snug font-bold text-foreground">
        {name}
      </h2>
      {details && (
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {details}
        </p>
      )}
    </div>
  );
};
