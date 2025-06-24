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

export interface Category {
  id: number;
  name: string;
  parent_id?: number;
  children?: Category[];
  created_at?: string;
  updated_at?: string;
}
