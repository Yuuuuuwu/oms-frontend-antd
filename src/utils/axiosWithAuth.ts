import axios from "axios";
import { BACKEND_URL } from "./env";
import { message } from "antd";

export const axiosWithAuth = axios.create({
  baseURL: BACKEND_URL, // 直接用 BACKEND_URL
});

// 自動帶上 token
axiosWithAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("oms-token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 統一處理 401
axiosWithAuth.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      message.error("登入認證已過期，請重新登入");
      localStorage.removeItem("oms-user");
      localStorage.removeItem("oms-token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
