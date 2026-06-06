import { cn } from "@/lib/utils";
import React from "react";
import { Container } from "./container";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { ProfileButton } from "./profile-button";

type Props = {
  className?: string;
};

export const Header: React.FC<Props> = ({ className }) => {
  return (
    <header className={cn("border border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        <Link href="/">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase">Croissants</h1>
              <p className="text-sm leading-3 text-gray-400">смачніше нікуди</p>
            </div>
          </div>
        </Link>
        <div className="mx-10 flex w-full">
          <SearchInput />
        </div>

        <div className="flex items-center gap-3">
          <ProfileButton />
          <CartButton />
        </div>
      </Container>
    </header>
  );
};
