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
