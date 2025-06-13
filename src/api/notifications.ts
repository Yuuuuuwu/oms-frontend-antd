import axios from "axios";

export interface Notification {
  id: number;
  user_id?: number;
  type: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

export async function fetchNotifications() {
  const res = await axios.get("/api/notifications");
  return res.data;
}

export async function markNotificationRead(id: number) {
  const res = await axios.post(`/api/notifications/${id}/read`);
  return res.data;
}

export async function fetchOperationLogs() {
  const res = await axios.get("/api/notifications/logs");
  return res.data;
}
