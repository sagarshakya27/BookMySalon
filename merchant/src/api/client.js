import axios from "axios";

const DEFAULT_BASE_URL = "http://10.77.206.74:8080";

const sanitizeBaseUrl = (value) => `${value || ""}`.trim().replace(/\/+$/, "");

export const BASE_URL = sanitizeBaseUrl(process.env.EXPO_PUBLIC_API_URL) || DEFAULT_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
