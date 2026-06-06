"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui";
import { LogOut, User } from "lucide-react";
import { AuthModal } from "./modals/auth-modal";
import Link from "next/link";

export const ProfileButton: React.FC = () => {
  const { data: session, status } = useSession();
  const [authOpen, setAuthOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await signOut({ redirect: false });
    } finally {
      setLoggingOut(false);
    }
  };

  if (status === "loading") {
    return (
      <Button variant="outline" disabled className="min-w-[100px]">
        ...
      </Button>
    );
  }

  if (user?.name) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/profile">
          <Button variant="outline" className="flex items-center gap-1">
            <User size={16} />
            {user.name}
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          type="button"
          disabled={loggingOut}
          onClick={handleLogout}
          title="Вийти"
        >
          <LogOut size={16} />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        className="flex items-center gap-1"
        type="button"
        onClick={() => setAuthOpen(true)}
      >
        <User size={16} /> Увійти
      </Button>
      <AuthModal open={authOpen} onOpenChange={setAuthOpen} />
    </>
  );
};
