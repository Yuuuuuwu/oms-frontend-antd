import { axiosWithAuth } from "./axiosWithAuth";
import type { User } from "../types/User";

const LOCAL_STORAGE_USER_KEY = "oms-user";
const LOCAL_STORAGE_TOKEN_KEY = "oms-token";

export async function login(email: string, password: string): Promise<boolean> {
  try {
    const res = await axiosWithAuth.post(`/auth/login`, { email, password });
    const token: string = res.data.access_token;
    const meRes = await axiosWithAuth.get(`/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meData = meRes.data;
    const userInfo: User = {
      id: meData.id,
      username: meData.username,
      email: meData.email,
      phone: meData.phone,
      role: meData.role,
      is_active: meData.is_active,
      created_at: meData.created_at,
      updated_at: meData.updated_at,
      last_login: meData.last_login,
    };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userInfo));
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);
    return true;
  } catch (err) {
    console.error("login 發生錯誤：", err);
    return false;
  }
}

export function logout() {
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
}

export async function forgotPassword(email: string): Promise<string | null> {
  try {
    const res = await axiosWithAuth.post(`/auth/forgot-password`, { email });
    return res.data.reset_token;
  } catch {
    return null;
  }
}

export async function resetPassword(token: string, newPassword: string): Promise<boolean> {
  try {
    await axiosWithAuth.post(`/auth/reset-password`, { token, new_password: newPassword });
    return true;
  } catch {
    return false;
  }
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export async function register(
  username: string,
  email: string,
  password: string,
  role: string,
  phone?: string
): Promise<boolean> {
  try {
    const payload: any = { username, email, password, role };
    if (phone && phone.trim()) {
      payload.phone = phone.trim();
    }
    
    const response = await axiosWithAuth.post(`/auth/register`, payload);
    console.log("註冊成功:", response.data);
    return true;
  } catch (err: any) {
    console.error("register 發生錯誤：", err);
    
    // 提供更詳細的錯誤訊息
    if (err.response?.data?.description) {
      console.error("伺服器錯誤:", err.response.data.description);
    }
    if (err.response?.data?.errors) {
      console.error("驗證錯誤:", err.response.data.errors);
    }
    
    return false;
  }
}
