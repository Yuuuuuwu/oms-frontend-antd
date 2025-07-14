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
      
      // 訂單管理系統假數據通知
      const fakeNotifications = [
        {
          id: 9001,
          title: "新訂單提醒",
          content: "客戶張小明提交了新訂單 #ORD-2025-001，總金額 $1,250",
          type: "order",
          is_read: false,
          created_at: dayjs().subtract(5, 'minute').toISOString(),
          user_id: null
        },
        {
          id: 9002,
          title: "庫存不足警告",
          content: "商品「iPhone 15 Pro」庫存僅剩 3 件，建議及時補貨",
          type: "system",
          is_read: false,
          created_at: dayjs().subtract(1, 'hour').toISOString(),
          user_id: null
        },
        {
          id: 9003,
          title: "付款確認",
          content: "訂單 #ORD-2025-002 已收到付款，金額 $2,850",
          type: "order",
          is_read: true,
          created_at: dayjs().subtract(2, 'hour').toISOString(),
          user_id: null
        },
        {
          id: 9004,
          title: "訂單狀態更新",
          content: "訂單 #ORD-2024-998 已出貨，預計明日送達客戶",
          type: "order",
          is_read: false,
          created_at: dayjs().subtract(4, 'hour').toISOString(),
          user_id: null
        },
        {
          id: 9005,
          title: "客戶服務請求",
          content: "客戶李大華對訂單 #ORD-2024-995 提出退貨申請",
          type: "customer",
          is_read: true,
          created_at: dayjs().subtract(6, 'hour').toISOString(),
          user_id: null
        },
        {
          id: 9006,
          title: "每日銷售報告",
          content: "今日完成 15 筆訂單，總銷售額 $45,200，較昨日增長 12%",
          type: "system",
          is_read: false,
          created_at: dayjs().subtract(8, 'hour').toISOString(),
          user_id: null
        },
        {
          id: 9007,
          title: "促銷活動提醒",
          content: "春季促銷活動將於明日結束，目前參與訂單 89 筆",
          type: "system",
          is_read: true,
          created_at: dayjs().subtract(1, 'day').toISOString(),
          user_id: null
        },
        {
          id: 9008,
          title: "異常訂單警報",
          content: "訂單 #ORD-2025-003 金額異常高（$15,000），請人工審核",
          type: "order",
          is_read: false,
          created_at: dayjs().subtract(1, 'day').toISOString(),
          user_id: null
        }
      ];

      // 合併真實通知和假通知
      const allNotifications = [...notList, ...fakeNotifications];
      
      setNotifications(
        allNotifications.map((n: any) => ({
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
      setNotifications((nots) => nots.map((n) => (n.id === id ? { ...n, is_read: true, read: true } : n)));
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
      setNotifications((nots) => nots.map((n) => ({ ...n, is_read: true, read: true })));
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
