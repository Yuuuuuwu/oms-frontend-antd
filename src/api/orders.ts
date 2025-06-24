import type { Order, OrderItem, OrderHistory } from "../types/Order";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { BACKEND_URL } from '../utils/env';

const API_URL = `${BACKEND_URL}/orders`;

export interface OrderItemPayload {
  product_id: number;
  qty: number;
}

// 取得訂單列表
export async function getOrders(params?: {
  status?: string;
  date_start?: string;
  date_end?: string;
  keyword?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}): Promise<{ data: Order[]; total: number }> {
  try {
    return (await axiosWithAuth.get(API_URL, { params })).data;
  } catch (e) {
    console.error("取得訂單列表失敗", e);
    throw e;
  }
}

// 取得單筆訂單詳情
export async function getOrderDetail(orderId: number): Promise<Order> {
  try {
    return (await axiosWithAuth.get(`${API_URL}/${orderId}`)).data;
  } catch (e) {
    console.error("取得訂單詳情失敗", e);
    throw e;
  }
}

// 以訂單編號查詢
export async function getOrderBySn(orderSn: string): Promise<Order> {
  try {
    const encodedSn = encodeURIComponent(orderSn);
    return (await axiosWithAuth.get(`${API_URL}/sn/${encodedSn}`)).data;
  } catch (e) {
    console.error("以訂單編號查詢失敗", e);
    throw e;
  }
}

// 新增訂單
export async function createOrder(payload: Order): Promise<Order> {
  try {
    return (await axiosWithAuth.post(API_URL, payload)).data;
  } catch (e) {
    console.error("新增訂單失敗", e);
    throw e;
  }
}

// 更新訂單
export async function updateOrder(
  id: number,
  payload: Order
): Promise<Order> {
  try {
    return (await axiosWithAuth.put(`${API_URL}/${id}`, payload)).data;
  } catch (e) {
    console.error("更新訂單失敗", e);
    throw e;
  }
}

// 批次更新訂單狀態
export async function updateOrderStatus(
  ids: number[],
  status: string,
  remark?: string
): Promise<void> {
  try {
    await axiosWithAuth.put(`${API_URL}/status`, { ids, status, remark });
  } catch (e) {
    console.error("批次更新訂單狀態失敗", e);
    throw e;
  }
}

// 查詢訂單歷史
export async function getOrderHistory(orderId: number): Promise<OrderHistory[]> {
  try {
    return (await axiosWithAuth.get(`${API_URL}/${orderId}/history`)).data;
  } catch (e) {
    console.error("取得訂單歷史失敗", e);
    throw e;
  }
}

// 刪除訂單
export async function deleteOrder(id: number): Promise<void> {
  try {
    await axiosWithAuth.delete(`${API_URL}/${id}`);
  } catch (e) {
    console.error("刪除訂單失敗", e);
    throw e;
  }
}
