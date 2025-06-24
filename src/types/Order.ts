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

export interface OrderPayload {
  receiver_name: string;
  receiver_phone: string;
  shipping_address: string;
  remark?: string;
  items: { product_id: number; qty: number }[];
}
