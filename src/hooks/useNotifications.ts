//src/hooks/useNotifications.ts
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { axiosWithAuth } from "../utils/axiosWithAuth";
import type { Notification } from "../types/Notification";

export function useNotifications(user: any) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 撈取通知
  const fetchNotifications = async () => {
    try {
      const res = await axiosWithAuth.get("/notifications");
      const notList = Array.isArray(res.data.data) ? res.data.data : [];
      setNotifications(
        notList.map((n: any) => ({
          ...n,
          time: dayjs(n.created_at),
          read: n.is_read,
        }))
      );
    } catch (e) {
      console.error("取得通知列表失敗", e);
    }
  };

  useEffect(() => {
    if (user.role && user.role !== "guest") {
      fetchNotifications();
    }
    // eslint-disable-next-line
  }, [user.role]);

  // 單筆標為已讀
  const handleRead = async (id: number, link?: string, navigate?: (path: string) => void) => {
    try {
      await axiosWithAuth.post(`/notifications/${id}/read`);
      setNotifications((nots) => nots.map((n) => (n.id === id ? { ...n, read: true } : n)));
      if (link && navigate) navigate(link);
    } catch (e) {
      console.error("標記通知為已讀失敗", e);
    }
  };

  // 全部標為已讀
  const handleMarkAllRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => !n.is_read)
          .map((n) => axiosWithAuth.post(`/notifications/${n.id}/read`))
      );
      setNotifications((nots) => nots.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      console.error("全部標為已讀失敗", e);
    }
  };

  return {
    notifications,
    fetchNotifications,
    handleRead,
    handleMarkAllRead,
    setNotifications,
  };
}
