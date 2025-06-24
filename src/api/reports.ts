import { axiosWithAuth } from '../utils/axiosWithAuth';
import { BACKEND_URL } from '../utils/env';
import type { ReportOrderStat, ProductRank } from '../types/Report';

export async function fetchOrderStats(params?: any) {
  const res = await axiosWithAuth.get(`${BACKEND_URL}/reports/order_stats`, { params });
  return res.data;
}

export async function fetchProductRank(params?: any) {
  const res = await axiosWithAuth.get(`${BACKEND_URL}/reports/product_rank`, { params });
  return res.data;
}

export async function fetchCustomerStats(params?: any) {
  const res = await axiosWithAuth.get(`${BACKEND_URL}/reports/customer_stats`, { params });
  return res.data;
}

export async function exportReportCSV(type: string, params?: any) {
  const res = await axiosWithAuth.get(`${BACKEND_URL}/reports/export/${type}`, {
    params,
    responseType: 'blob',
  });
  return res.data;
}
