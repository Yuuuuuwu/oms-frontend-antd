import type { Customer } from '../types/Customer';
import { axiosWithAuth } from '../utils/axiosWithAuth';

export async function fetchCustomers() {
  try {
    const res = await axiosWithAuth.get(`/customers`);
    return res.data;
  } catch (e) {
    console.error("取得客戶列表失敗", e);
    return [];
  }
}

export async function createCustomer(data: Omit<Customer, 'id'>) {
  try {
    const res = await axiosWithAuth.post(`/customers`, data);
    return res.data;
  } catch (e) {
    console.error("新增客戶失敗", e);
    return null;
  }
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  try {
    const res = await axiosWithAuth.put(`/customers/${id}`, data);
    return res.data;
  } catch (e) {
    console.error("更新客戶失敗", e);
    return null;
  }
}

export async function deleteCustomer(id: string) {
  try {
    await axiosWithAuth.delete(`/customers/${id}`);
    return true;
  } catch (e) {
    console.error("刪除客戶失敗", e);
    return false;
  }
}
