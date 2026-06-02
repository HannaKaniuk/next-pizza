import { AxiosError, type AxiosRequestConfig } from "axios";
import { api } from "@/services/instance";

export class ApiClientError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

const toApiClientError = (error: unknown): ApiClientError => {
  if (error instanceof AxiosError) {
    return new ApiClientError(
      error.response?.data?.message ?? error.message,
      error.response?.status,
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
