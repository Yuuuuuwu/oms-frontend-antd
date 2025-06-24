// src/api/payments.ts
import type { Payment, PaymentPayload } from "../types/Payment";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { BACKEND_URL } from '../utils/env';

const API_URL = `${BACKEND_URL}/payments`;

export async function payOrder(
  order_id: number,
  payload: PaymentPayload
): Promise<Payment|null> {
  try {
    const res = await axiosWithAuth.post(`${API_URL}/${order_id}`, payload);
    return res.data;
  } catch (e) {
    console.error("訂單付款失敗", e);
    return null;
  }
}
