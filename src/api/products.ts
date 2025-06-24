// src/api/products.ts
import type { Product, ProductPayload, Category } from "../types/Product";
// 已移除 interface Product, ProductPayload, Category，統一用 types/Product。
import { axiosWithAuth } from "../utils/axiosWithAuth";
import { BACKEND_URL } from '../utils/env';

const API_URL = `/products`;
const CAT_URL = `/categories`;

export async function getProducts(params?: any): Promise<{
  data: Product[];
  total: number;
}> {
  try {
    const res = await axiosWithAuth.get(API_URL, { params });
    return res.data;
  } catch (e) {
    console.error("取得商品列表失敗", e);
    return { data: [], total: 0 };
  }
}

export async function getProduct(id: number): Promise<Product|null> {
  try {
    const res = await axiosWithAuth.get(`${API_URL}/${id}`);
    return res.data;
  } catch (e) {
    console.error("取得商品詳情失敗", e);
    return null;
  }
}

export async function createProduct(payload: ProductPayload): Promise<Product|null> {
  try {
    const res = await axiosWithAuth.post(API_URL, payload);
    return res.data;
  } catch (e) {
    console.error("新增商品失敗", e);
    return null;
  }
}

export async function updateProduct(
  id: number,
  payload: ProductPayload
): Promise<Product|null> {
  try {
    const res = await axiosWithAuth.put(`${API_URL}/${id}`, payload);
    return res.data;
  } catch (e) {
    console.error("更新商品失敗", e);
    return null;
  }
}

export async function deleteProduct(id: number): Promise<boolean> {
  try {
    await axiosWithAuth.delete(`${API_URL}/${id}`);
    return true;
  } catch (e) {
    console.error("刪除商品失敗", e);
    return false;
  }
}

export async function batchSetActive(ids: number[], is_active: boolean): Promise<boolean> {
  try {
    await axiosWithAuth.put(`${API_URL}/batch/active`, { ids, is_active });
    return true;
  } catch (e) {
    console.error("批次上下架失敗", e);
    return false;
  }
}

export async function changeStock(id: number, delta: number): Promise<Product|null> {
  try {
    const res = await axiosWithAuth.put(`${API_URL}/${id}/stock`, { delta });
    return res.data;
  } catch (e) {
    console.error("庫存異動失敗", e);
    return null;
  }
}

// 分類 API
export async function getCategories(): Promise<Category[]> {
  try {
    const res = await axiosWithAuth.get(CAT_URL);
    return res.data;
  } catch (e) {
    console.error("取得分類列表失敗", e);
    return [];
  }
}
export async function createCategory(
  payload: { name: string; parent_id?: number }
): Promise<Category|null> {
  try {
    const res = await axiosWithAuth.post(CAT_URL, payload);
    return res.data;
  } catch (e) {
    console.error("新增分類失敗", e);
    return null;
  }
}
export async function updateCategory(
  id: number,
  payload: { name?: string; parent_id?: number }
): Promise<Category|null> {
  try {
    const res = await axiosWithAuth.put(`${CAT_URL}/${id}`, payload);
    return res.data;
  } catch (e) {
    console.error("更新分類失敗", e);
    return null;
  }
}
export async function deleteCategory(id: number): Promise<boolean> {
  try {
    await axiosWithAuth.delete(`${CAT_URL}/${id}`);
    return true;
  } catch (e) {
    console.error("刪除分類失敗", e);
    return false;
  }
}
