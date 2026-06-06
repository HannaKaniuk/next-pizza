import { AxiosError, type AxiosRequestConfig } from "axios";
import { api } from "@/services/instance";

type ApiErrorBody = {
  message?: string;
  code?: string;
  needsVerification?: boolean;
  email?: string;
};

export class ApiClientError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly needsVerification?: boolean;
  readonly email?: string;

  constructor(
    message: string,
    status?: number,
    extras?: Pick<ApiErrorBody, "code" | "needsVerification" | "email">,
  ) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.code = extras?.code;
    this.needsVerification = extras?.needsVerification;
    this.email = extras?.email;
  }
}

const toApiClientError = (error: unknown): ApiClientError => {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorBody | undefined;

    return new ApiClientError(
      data?.message ?? error.message,
      error.response?.status,
      {
        code: data?.code,
        needsVerification: data?.needsVerification,
        email: data?.email,
      },
    );
  }

  if (error instanceof Error) {
    return new ApiClientError(error.message);
  }

  return new ApiClientError("Unexpected API error");
};

export const apiClient = {
  async get<TResponse>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await api.get<TResponse>(url, config);
      return response.data;
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) {
    try {
      const response = await api.post<TResponse>(url, body, config);
      return response.data;
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig<TBody>,
  ) {
    try {
      const response = await api.patch<TResponse>(url, body, config);
      return response.data;
    } catch (error) {
      throw toApiClientError(error);
    }
  },

  async delete<TResponse>(url: string, config?: AxiosRequestConfig) {
    try {
      const response = await api.delete<TResponse>(url, config);
      return response.data;
    } catch (error) {
      throw toApiClientError(error);
    }
  },
};
