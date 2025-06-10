// src/utils/auth.ts

export type UserRole = "admin" | "user";

export interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

const LOCAL_STORAGE_USER_KEY = "oms-user";
const LOCAL_STORAGE_TOKEN_KEY = "oms-token";

export async function register(
  username: string,
  email: string,
  password: string,
  role: UserRole
): Promise<boolean> {
  try {
    const res = await fetch("http://localhost:5000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, role }),
    });
    if (res.status === 201) {
      const data = await res.json();
      const userInfo: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userInfo));
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, data.access_token);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error("register 發生錯誤：", err);
    return false;
  }
}

export async function login(email: string, password: string): Promise<boolean> {
  try {
    // 1. 先呼叫 /auth/login 拿到 access_token
    const res = await fetch("http://localhost:5000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // 以 email 登入
    });
    if (!res.ok) {
      return false;
    }
    const loginData = await res.json();
    const token: string = loginData.access_token;

    // 2. 拿到 token 後，再呼叫 /auth/me 取得 { id, username, email, role }
    const meRes = await fetch("http://localhost:5000/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!meRes.ok) {
      return false;
    }
    const meData = await meRes.json();
    const userInfo: User = {
      id: meData.id,
      username: meData.username,
      email: meData.email,
      role: meData.role,
    };

    // 3. 把 user 與 token 一起存入 localStorage
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(userInfo));
    localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, token);

    return true;
  } catch (err) {
    console.error("login 發生錯誤：", err);
    return false;
  }
}

export function getCurrentUser(): User | null {
  const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function getToken(): string | null {
  return localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
}

export function logout() {
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
}
export async function forgotPassword(email: string): Promise<string | null> {
  const res = await fetch("http://localhost:5000/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (res.ok) {
    const data = await res.json();
    return data.reset_token; // 這是測試用，實務應寄信
  }
  return null;
}

export async function resetPassword(
  token: string,
  newPassword: string
): Promise<boolean> {
  const res = await fetch("http://localhost:5000/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });
  return res.ok;
}
