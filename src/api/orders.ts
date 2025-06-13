import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:5000/orders";

export interface OrderItemPayload {
  product_id: number;
  qty: number;
}

export interface OrderPayload {
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  remark?: string;
  items: OrderItemPayload[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  qty: number;
  price: number;
  created_at: string;
}

export interface OrderHistory {
  id: number;
  order_id: number;
  status: string;
  operator: string;
  operated_at: string;
  remark?: string;
}

export interface Order {
  id: number;
  order_sn: string;
  user_id: number;
  total_amount: number;
  status: string;
  shipping_fee: number;
  payment_status: string;
  remark?: string;
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
  history?: OrderHistory[];
}

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
  const url = new URL(API_URL);
  if (params)
    Object.entries(params).forEach(
      ([k, v]) => v && url.searchParams.append(k, String(v))
    );
  const res = await fetchWithAuth(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("取得訂單失敗");
  return await res.json();
}

export async function getOrderDetail(orderId: number): Promise<Order> {
  const res = await fetchWithAuth(`${API_URL}/${orderId}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("取得訂單詳情失敗");
  return await res.json();
}

export async function createOrder(payload: OrderPayload): Promise<Order> {
  const res = await fetchWithAuth(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    } as Record<string, string>,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("新增訂單失敗");
  return await res.json();
}

export async function updateOrder(
  id: number,
  payload: OrderPayload
): Promise<Order> {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    } as Record<string, string>,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("更新訂單失敗");
  return await res.json();
}

export async function updateOrderStatus(
  ids: number[],
  status: string,
  remark?: string
): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" } as Record<
      string,
      string
    >,
    body: JSON.stringify({ ids, status, remark }),
  });
  if (!res.ok) throw new Error("狀態更新失敗");
}

export async function getOrderHistory(
  orderId: number
): Promise<OrderHistory[]> {
  const res = await fetchWithAuth(`${API_URL}/${orderId}/history`, {
    headers: { "Content-Type": "application/json" } as Record<
      string,
      string
    >,
  });
  if (!res.ok) throw new Error("取得歷史紀錄失敗");
  return await res.json();
}

export async function deleteOrder(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    } as Record<string, string>,
  });
  if (!res.ok) throw new Error("刪除訂單失敗");
}
