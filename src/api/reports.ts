import { axiosWithAuth } from '../utils/axiosWithAuth';

export async function fetchOrderStats(params?: any) {
  const res = await axiosWithAuth.get(`/reports/order_stats`, { params });
  return res.data;
}

export async function fetchProductRank(params?: any) {
  const res = await axiosWithAuth.get(`/reports/product_rank`, { params });
  return res.data;
}

export async function fetchCustomerStats(params?: any) {
  const res = await axiosWithAuth.get(`/reports/customer_stats`, { params });
  return res.data;
}

export async function exportReportCSV(type: string, params?: any) {
  const res = await axiosWithAuth.get(`/reports/export/${type}`, {
    params,
    responseType: 'blob',
  });
  return res.data;
}
