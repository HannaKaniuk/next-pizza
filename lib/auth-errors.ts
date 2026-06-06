const AUTH_ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Невірний email, пароль або код",
  email_not_verified: "Підтвердіть email перед входом",
  invalid_verification_code: "Невірний код",
  expired_verification_code: "Код прострочений. Надіслали новий на email",
  Configuration: "Auth не налаштовано (перевірте .env)",
};

export function getAuthErrorMessage(code?: string | null) {
  if (!code) {
    return "Щось пішло не так";
  }

  return AUTH_ERROR_MESSAGES[code] ?? "Щось пішло не так";
}
