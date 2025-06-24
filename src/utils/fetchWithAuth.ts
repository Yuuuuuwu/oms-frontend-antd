import { logout } from "./auth";
import { message } from "antd";
import { BACKEND_URL } from "./env";

export async function fetchWithAuth(input: RequestInfo, init?: RequestInit) {
  let url =
    typeof input === "string" && input.startsWith("/")
      ? BACKEND_URL + input
      : input;

  // 確保 headers 型別正確
  let headers: Record<string, string> = {};
  if (init && init.headers) {
    if (init.headers instanceof Headers) {
      init.headers.forEach((v, k) => (headers[k] = v));
    } else {
      headers = { ...init.headers } as Record<string, string>;
    }
  }
  const token = localStorage.getItem("oms-token");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(url, { ...init, headers });
  if (res.status === 401) {
    message.error("登入已過期，請重新登入");
    logout();
    window.location.href = "/login";
    throw new Error("未授權，請重新登入");
  }
  return res;
}
