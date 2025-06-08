// src/api/users.ts
import axios from "axios";
import { getToken } from "../utils/auth";
import type { User } from "../utils/auth"; // 與 auth.ts 同步

// 在發出請求前自動加上 Authorization: Bearer <token>
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const API_URL = "http://localhost:5000/users";

// 匯出 User 型別
export type { User };

// 取得所有使用者
export async function getUsers(): Promise<User[]> {
  const res = await axios.get(API_URL);
  return res.data;
}

// 新增使用者
export async function createUser(data: Omit<User, "id">): Promise<User> {
  const res = await axios.post(API_URL, data);
  return res.data;
}

// 刪除使用者
export async function deleteUser(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}
