// src/api/products.ts
import { fetchWithAuth } from "../utils/fetchWithAuth";

const API_URL = "http://localhost:5000/products";
const CAT_URL = "http://localhost:5000/categories";

export interface Category {
  id: number;
  name: string;
  parent_id?: number;
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductPayload {
  name: string;
  price: number;
  promo_price?: number;
  stock: number;
  desc?: string;
  image_url?: string;
  is_active?: boolean;
  category_id?: number;
}

export interface Product extends ProductPayload {
  id: number;
  created_at?: string;
  updated_at?: string;
  category?: Category;
}

export async function getProducts(params?: any): Promise<{
  data: Product[];
  total: number;
}> {
  const url = new URL(API_URL);
  if (params)
    Object.entries(params).forEach(
      ([k, v]) => v && url.searchParams.append(k, String(v))
    );
  const res = await fetchWithAuth(url.toString(), {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("取得商品失敗");
  return await res.json();
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("取得商品失敗");
  return await res.json();
}

export async function createProduct(payload: ProductPayload): Promise<Product> {
  const res = await fetchWithAuth(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("新增商品失敗");
  return await res.json();
}

export async function updateProduct(
  id: number,
  payload: ProductPayload
): Promise<Product> {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("更新商品失敗");
  return await res.json();
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("刪除商品失敗");
}

export async function batchSetActive(ids: number[], is_active: boolean): Promise<void> {
  const res = await fetchWithAuth(`${API_URL}/batch/active`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, is_active }),
  });
  if (!res.ok) throw new Error("批次上下架失敗");
}

export async function changeStock(id: number, delta: number): Promise<Product> {
  const res = await fetchWithAuth(`${API_URL}/${id}/stock`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ delta }),
  });
  if (!res.ok) throw new Error("庫存異動失敗");
  return await res.json();
}

// 分類 API
export async function getCategories(): Promise<Category[]> {
  const res = await fetchWithAuth(CAT_URL, {
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("取得分類失敗");
  return await res.json();
}
export async function createCategory(
  payload: { name: string; parent_id?: number }
): Promise<Category> {
  const res = await fetchWithAuth(CAT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("新增分類失敗");
  return await res.json();
}
export async function updateCategory(
  id: number,
  payload: { name?: string; parent_id?: number }
): Promise<Category> {
  const res = await fetchWithAuth(`${CAT_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("更新分類失敗");
  return await res.json();
}
export async function deleteCategory(id: number): Promise<void> {
  const res = await fetchWithAuth(`${CAT_URL}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("刪除分類失敗");
}
