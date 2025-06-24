export interface ReportOrderStat {
  date: string;
  total_amount: number;
  order_count: number;
}

export interface ProductRank {
  product_id: number;
  product_name: string;
  total_amount: number;
  total_qty: number;
}
