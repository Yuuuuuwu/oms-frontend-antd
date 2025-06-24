// src/api/users.ts
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { BACKEND_URL } from "../utils/env";
import type { User, UserPayload } from "../types/User";

const API_URL = `/users`;

/**
 * 取得所有使用者列表
 */
export async function getUsers(): Promise<{ data: User[]; total: number }> {
  const res = await axiosWithAuth.get(API_URL);
  return res.data;
}

/**
 * 新增使用者
 */
export async function createUser(payload: UserPayload): Promise<User> {
  const res = await axiosWithAuth.post(API_URL, payload);
  return res.data;
}

/**
 * 更新使用者
 */
export async function updateUser(id: number, payload: UserPayload): Promise<User> {
  const res = await axiosWithAuth.put(`${API_URL}/${id}`, payload);
  return res.data;
}

/**
 * 刪除使用者
 */
export async function deleteUser(id: number): Promise<void> {
  await axiosWithAuth.delete(`${API_URL}/${id}`);
}

/**
 * (可選) 取得單一使用者詳細資料
 */
export async function getUser(id: number): Promise<User> {
  const res = await axiosWithAuth.get(`${API_URL}/${id}`);
  return res.data;
}
