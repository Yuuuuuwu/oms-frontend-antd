// src/api/users.ts
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:5000/users";

export interface UserPayload {
  username: string;
  email: string;
  password?: string;
  phone?: string;
  role?: string;
}

export interface User extends UserPayload {
  id: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export async function getUsers(): Promise<{ data: User[]; total: number }> {
  const res = await fetchWithAuth(API_URL, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("取得使用者失敗");
  return await res.json();
}

export async function createUser(payload: UserPayload): Promise<User> {
  const res = await fetchWithAuth(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("新增使用者失敗");
  return await res.json();
}

export async function updateUser(
  id: number,
  payload: UserPayload
): Promise<User> {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("更新使用者失敗");
  return await res.json();
}

export async function deleteUser(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("刪除使用者失敗");
}
