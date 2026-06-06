"use client";

import Link from "next/link";
import { Croissant, Sparkles } from "lucide-react";
import { Button } from "../ui";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

export const CartEmptyState: React.FC<Props> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex h-full min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center",
        className,
      )}
    >
      <div className="relative mb-8 size-36">
        <span className="bg-primary/15 absolute inset-0 animate-pulse rounded-full blur-2xl" />
        <span className="bg-primary/10 absolute -left-3 top-2 size-20 rounded-full blur-xl" />
        <span className="bg-amber-200/40 absolute -right-2 bottom-0 size-16 rounded-full blur-lg" />

        <div className="relative flex size-full items-center justify-center">
          <div className="absolute -right-1 -top-1 rotate-12 text-amber-400">
            <Sparkles className="size-5 animate-pulse" strokeWidth={2.5} />
          </div>
          <div className="bg-primary/10 ring-primary/20 flex size-28 items-center justify-center rounded-[2rem] ring-4">
            <Croissant
              className="text-primary size-14 -rotate-12 animate-[bounce_2s_ease-in-out_infinite]"
              strokeWidth={1.75}
            />
          </div>
          <span className="absolute -bottom-1 -left-2 text-2xl opacity-80">🥐</span>
          <span className="absolute -right-3 top-8 text-xl opacity-70">✨</span>
        </div>
      </div>

      <h3 className="text-xl font-extrabold tracking-tight">
        Кошик як свіжа випічка
      </h3>
      <p className="text-muted-foreground mt-2 max-w-[240px] text-sm leading-relaxed">
        …тобто порожній. Додай круасан — і тут одразу стане смачно.
      </p>

      <SheetClose asChild>
        <Button
          asChild
          className="mt-8 h-11 rounded-xl px-8 text-sm font-bold shadow-md"
        >
          <Link href="/">Обрати смаколик</Link>
        </Button>
      </SheetClose>
    </div>
  );
};
