export interface Notification {
  id: number;
  user_id?: number;
  type: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
}
