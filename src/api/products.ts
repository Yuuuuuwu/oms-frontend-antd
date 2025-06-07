// src/api/products.ts
import axios from "axios";
import { getToken } from "../utils/auth"; // # 修改：拿到 JWT

// 全域攔截器，自動幫每一個請求加上 Authorization header
axios.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const API_URL = "http://localhost:5000/products";

export interface ProductPayload {
  name: string;
  price: number;
  stock: number;
  desc?: string;
}

export async function getProducts(): Promise<
  ProductPayload & { id: number }[]
> {
  const res = await axios.get(API_URL); // GET /products
  return res.data;
}

export async function createProduct(
  payload: ProductPayload
): Promise<ProductPayload & { id: number }> {
  const res = await axios.post(API_URL, payload); // POST /products
  return res.data;
}

export async function updateProduct(
  id: number,
  payload: ProductPayload
): Promise<ProductPayload & { id: number }> {
  const res = await axios.put(`${API_URL}/${id}`, payload); // PUT /products/:id
  return res.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await axios.delete(`${API_URL}/${id}`); // DELETE /products/:id
}
