// src/api/orders.ts

import axios from "axios";
import { getToken } from "../utils/auth"; // # 修改：匯入 getToken 以取得 JWT
import type { Order } from "../types/orders"; // # 修改：匯入 Order 型別

// ===== 新增 axios 攔截器，將 JWT 自動加到 Authorization 標頭 =====
axios.interceptors.request.use((config) => {
  const token = getToken(); // # 修改：從 localStorage 取得 token
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`; // # 修改：將 token 加入 Authorization 標頭
  }
  return config;
});

const API_URL = "http://localhost:5000/orders"; // 根據後端實際路徑調整

export async function getOrders(): Promise<Order[]> {
  const res = await axios.get(API_URL);
  return res.data;
}

export async function getOrderDetail(orderId: string): Promise<Order> {
  const res = await axios.get(`${API_URL}/${orderId}`);
  return res.data;
}

export async function createOrder(order: Partial<Order>): Promise<Order> {
  const res = await axios.post(API_URL, order);
  return res.data;
}

export async function updateOrder(
  orderId: string,
  order: Partial<Order>
): Promise<Order> {
  const res = await axios.put(`${API_URL}/${orderId}`, order);
  return res.data;
}

export async function deleteOrder(orderId: string): Promise<void> {
  await axios.delete(`${API_URL}/${orderId}`);
}
