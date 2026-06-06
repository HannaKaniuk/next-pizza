export function isDevEmailMode() {
  return !process.env.RESEND_API_KEY && process.env.NODE_ENV !== "production";
}

export async function sendVerificationEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "onboarding@resend.dev";

  if (!apiKey) {
    if (isDevEmailMode()) {
      console.info(
        `[dev] Код підтвердження для ${to}: ${code} (дійсний 15 хв)`,
      );
      return;
    }

    throw new Error("RESEND_API_KEY is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Код підтвердження — Next Pizza",
      html: `
        <p>Вітаємо!</p>
        <p>Ваш код підтвердження: <strong style="font-size:24px;letter-spacing:2px">${code}</strong></p>
        <p>Код дійсний 15 хвилин.</p>
        <p>Якщо ви не реєструвались — проігноруйте цей лист.</p>
      `,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Failed to send email: ${response.status} ${details}`);
  }
}
