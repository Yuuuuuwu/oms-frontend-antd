import axios from 'axios';

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

export async function fetchOrderStats(params?: any) {
  const res = await axios.get('/api/reports/order_stats', { params });
  return res.data;
}

export async function fetchProductRank(params?: any) {
  const res = await axios.get('/api/reports/product_rank', { params });
  return res.data;
}

export async function fetchCustomerStats(params?: any) {
  const res = await axios.get('/api/reports/customer_stats', { params });
  return res.data;
}

export async function exportReportCSV(type: string, params?: any) {
  const res = await axios.get(`/api/reports/export/${type}`, {
    params,
    responseType: 'blob',
  });
  return res.data;
}
