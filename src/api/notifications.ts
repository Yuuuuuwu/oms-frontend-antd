import { axiosWithAuth } from "../utils/axiosWithAuth";
import { BACKEND_URL } from '../utils/env';

export async function fetchNotifications() {
  try {
    const res = await axiosWithAuth.get(`${BACKEND_URL}/notifications`);
    return res.data;
  } catch (e) {
    console.error("取得通知列表失敗", e);
    return [];
  }
}

export async function markNotificationRead(id: number) {
  try {
    const res = await axiosWithAuth.post(`${BACKEND_URL}/notifications/${id}/read`);
    return res.data;
  } catch (e) {
    console.error("標記通知為已讀失敗", e);
    return null;
  }
}

export async function fetchOperationLogs() {
  try {
    const res = await axiosWithAuth.get(`${BACKEND_URL}/notifications/logs`);
    return res.data;
  } catch (e) {
    console.error("取得操作紀錄失敗", e);
    return [];
  }
}
