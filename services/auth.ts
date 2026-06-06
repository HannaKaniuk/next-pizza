import { apiClient } from "@/services/api-client";

type VerificationResponse = {
  email: string;
  message: string;
  devCode?: string;
};

export type RegisterResponse = VerificationResponse & {
  needsVerification: true;
};

export const authService = {
  register(fullName: string, email: string, password: string) {
    return apiClient.post<RegisterResponse>("/api/auth/register", {
      fullName,
      email,
      password,
    });
  },

  resendVerification(email: string) {
    return apiClient.post<VerificationResponse>(
      "/api/auth/resend-verification",
      { email },
    );
  },
};
