export interface User {
  id: number;
  username: string;
  email: string;
  phone?: string;
  role: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  last_login?: string;
}

export interface UserPayload {
  username: string;
  email: string;
  phone?: string;
  role: string;
  password?: string;
}
