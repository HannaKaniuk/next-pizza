"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import { authService } from "@/services/auth";
import { ApiClientError } from "@/services/api-client";
import { getAuthErrorMessage } from "@/lib/auth-errors";

type AuthMode = "login" | "register" | "verify";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className?: string;
};

export const AuthModal: React.FC<Props> = ({ open, onOpenChange, className }) => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [info, setInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchCart = useCartStore((state) => state.fetchCart);

  const resetForm = () => {
    setError(null);
    setInfo(null);
    setFullName("");
    setEmail("");
    setPassword("");
    setVerificationCode("");
    setMode("login");
  };

  const verificationInfo = (message: string, devCode?: string) =>
    devCode
      ? `${message} Код для dev: ${devCode}`
      : message;

  const goToVerify = (
    targetEmail: string,
    message?: string,
    devCode?: string,
  ) => {
    setEmail(targetEmail);
    setMode("verify");
    setError(null);
    setInfo(
      verificationInfo(
        message ?? "На email надіслано 6-значний код. Введіть його нижче.",
        devCode,
      ),
    );
  };

  const finishAuth = async () => {
    await fetchCart();
    resetForm();
    onOpenChange(false);
  };

  const credentialsSignIn = async (payload: {
    email: string;
    password?: string;
    code?: string;
  }) => {
    const result = await signIn("credentials", {
      ...payload,
      redirect: false,
    });

    if (result?.ok) {
      await finishAuth();
      return;
    }

    if (result?.code === "email_not_verified") {
      goToVerify(payload.email, getAuthErrorMessage(result.code));
      return;
    }

    setError(getAuthErrorMessage(result?.code));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    setSubmitting(true);

    try {
      if (mode === "login") {
        await credentialsSignIn({ email, password });
        return;
      }

      if (mode === "register") {
        const response = await authService.register(fullName, email, password);
        goToVerify(response.email, response.message, response.devCode);
        return;
      }

      await credentialsSignIn({
        email,
        code: verificationCode,
        password: "",
      });
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Щось пішло не так",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setError(null);
    setInfo(null);
    setSubmitting(true);

    try {
      const response = await authService.resendVerification(email);
      setInfo(
        verificationInfo(
          response.message ?? "Новий код надіслано на email",
          response.devCode,
        ),
      );
    } catch (err) {
      setError(
        err instanceof ApiClientError ? err.message : "Не вдалося надіслати код",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    mode === "login"
      ? "Вхід"
      : mode === "register"
        ? "Реєстрація"
        : "Підтвердження email";

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetForm();
        onOpenChange(next);
      }}
    >
      <DialogContent className={cn("sm:max-w-[420px]", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {mode === "verify" && (
          <p className="text-sm text-muted-foreground">
            Код надіслано на <span className="font-medium">{email}</span>
          </p>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "register" && (
            <Input
              placeholder="Імʼя"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}

          {mode !== "verify" && (
            <>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </>
          )}

          {mode === "verify" && (
            <Input
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="Код з email (6 цифр)"
              value={verificationCode}
              onChange={(e) =>
                setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              required
              minLength={6}
              maxLength={6}
            />
          )}

          {info && <p className="text-sm text-primary">{info}</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting
              ? "Зачекайте..."
              : mode === "login"
                ? "Увійти"
                : mode === "register"
                  ? "Зареєструватися"
                  : "Підтвердити"}
          </Button>
        </form>

        {mode === "verify" && (
          <div className="space-y-3 text-center text-sm text-muted-foreground">
            <button
              type="button"
              className="text-primary font-medium underline-offset-4 hover:underline disabled:opacity-50"
              disabled={submitting}
              onClick={handleResend}
            >
              Надіслати код ще раз
            </button>
            <p>
              <button
                type="button"
                className="text-primary font-medium underline-offset-4 hover:underline"
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setInfo(null);
                }}
              >
                Повернутися до входу
              </button>
            </p>
          </div>
        )}

        {mode !== "verify" && (
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Немає акаунту?{" "}
                <button
                  type="button"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode("register");
                    setError(null);
                    setInfo(null);
                  }}
                >
                  Зареєструватися
                </button>
              </>
            ) : (
              <>
                Вже є акаунт?{" "}
                <button
                  type="button"
                  className="text-primary font-medium underline-offset-4 hover:underline"
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setInfo(null);
                  }}
                >
                  Увійти
                </button>
              </>
            )}
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
};
