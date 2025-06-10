export type UserRole = "admin" | "user";

let currentUser: { username: string; role: UserRole } | null = null;

export async function fakeLogin(username: string, password: string) {
  // 假資料，可換成API
  if (
    (username === "admin" && password === "admin") ||
    (username === "user" && password === "user")
  ) {
    currentUser = { username, role: username === "admin" ? "admin" : "user" };
    localStorage.setItem("oms-user", JSON.stringify(currentUser));
    return true;
  }
  return false;
}

export async function fakeRegister(
  username: string,
  password: string,
  role: UserRole
) {
  // 只做前端假註冊（這邊只檢查admin,user帳號已存在）
  if (username === "admin" || username === "user") {
    return false; // 已存在
  }
  currentUser = { username, role };
  localStorage.setItem("oms-user", JSON.stringify(currentUser));
  return true;
}

<<<<<<< HEAD
export function getCurrentUser() {
  if (!currentUser) {
    const raw = localStorage.getItem("oms-user");
    if (raw) currentUser = JSON.parse(raw);
=======
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
>>>>>>> 20d2f55 (新增忘記密碼與重設密碼功能，更新登入與註冊頁面以支援 email 登入)
  }
  return currentUser;
}

export function logout() {
  currentUser = null;
  localStorage.removeItem("oms-user");
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
