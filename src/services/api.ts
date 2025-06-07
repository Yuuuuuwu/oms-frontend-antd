// src/services/api.ts
import axios from "axios";

// 從環境變數讀取後端 URL
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// 建立一個 Axios instance，之後所有 API 呼叫都從這個 instance 發出
export const apiClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 在發送請求時，如果 localStorage 有 token，就自動帶到 header
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
