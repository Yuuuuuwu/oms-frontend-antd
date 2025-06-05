export interface Order {
  orderId: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  remark?: string;
}

export const orders: Order[] = [
  {
    orderId: "O123",
    customer: "王小明",
    amount: 1200,
    status: "已完成",
    date: "2025-06-01",
    items: [
      { name: "商品A", qty: 2, price: 500 },
      { name: "商品B", qty: 1, price: 200 },
    ],
    remark: "急件，請盡快出貨",
  },
];
