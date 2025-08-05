import { axiosWithAuth } from '../utils/axiosWithAuth';

export async function fetchOrderStats(params?: any) {
  const res = await axiosWithAuth.get(`/api/reports/sales`, { params });
  return res.data;
}

export async function fetchProductRank(params?: any) {
  const res = await axiosWithAuth.get(`/api/reports/product-ranking`, { params });
  return res.data;
}

export async function fetchCustomerStats(params?: any) {
  const res = await axiosWithAuth.get(`/api/reports/customer-summary`, { params });
  return res.data;
}

export async function exportReportCSV(type: string, params?: any) {
  const res = await axiosWithAuth.get(`/api/reports/export/${type}`, {
    params,
    responseType: 'blob',
  });
  return res.data;
}
