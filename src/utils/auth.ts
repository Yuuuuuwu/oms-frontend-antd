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

export function getCurrentUser() {
  if (!currentUser) {
    const raw = localStorage.getItem("oms-user");
    if (raw) currentUser = JSON.parse(raw);
  }
  return currentUser;
}

export function logout() {
  currentUser = null;
  localStorage.removeItem("oms-user");
}
