import axios from "axios";
import { Order } from "../types/orders";

const API_URL = "http://localhost:8000/api/orders"; // 根據後端實際路徑調整

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
