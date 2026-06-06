import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window !== "undefined"
    ? ""
    : (process.env.API_URL ?? "http://localhost:3000"));

export const api = axios.create({
  baseURL,
  withCredentials: true,
});
