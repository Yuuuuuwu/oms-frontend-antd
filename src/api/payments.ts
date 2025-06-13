// src/api/payments.ts
import { getToken } from "../utils/auth";

const API_URL = "http://localhost:5000/payments";

export interface PaymentPayload {
  order_id: number;
  amount: number;
  payment_method: string;
}

export interface Payment extends PaymentPayload {
  id: number;
  status?: string;
  transaction_id?: string;
  paid_at?: string;
  created_at?: string;
  updated_at?: string;
}

function authHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function payOrder(
  order_id: number,
  payload: PaymentPayload
): Promise<Payment> {
  const res = await fetch(`${API_URL}/${order_id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() } as Record<
      string,
      string
    >,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("付款失敗");
  return await res.json();
}
