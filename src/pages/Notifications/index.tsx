import React, { useEffect, useState } from "react";
import { Card, List, message, Spin, Typography, Tag, Tabs } from "antd";
import type { Notification } from "../../types/Notification";
import {
  fetchNotifications,
  markNotificationRead
} from "../../api/notifications";

const { Text } = Typography;

// 通知分類標籤（與下拉預覽相同）
const notificationTabs = [
  { key: "all", label: "全部" },
  { key: "order", label: "訂單" },
  { key: "system", label: "系統" },
  { key: "customer", label: "客服" },
];

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [readLoadingId, setReadLoadingId] = useState<number | null>(null); // 避免重複點擊
  const [activeTab, setActiveTab] = useState<string>("all"); // 當前分頁

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetchNotifications();
      let apiNotifications = Array.isArray(res) ? res : [];
      
      // 訂單管理系統假數據通知（完整版）
      const fakeNotifications = [
        {
          id: 9001,
          title: "新訂單提醒",
          content: "客戶張小明提交了新訂單 #ORD-2025-001，總金額 $1,250",
          type: "order",
          is_read: false,
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5分鐘前
          user_id: null
        },
        {
          id: 9002,
          title: "庫存不足警告",
          content: "商品「iPhone 15 Pro」庫存僅剩 3 件，建議及時補貨",
          type: "system",
          is_read: false,
          created_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1小時前
          user_id: null
        },
        {
          id: 9003,
          title: "付款確認",
          content: "訂單 #ORD-2025-002 已收到付款，金額 $2,850",
          type: "order",
          is_read: true,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小時前
          user_id: null
        },
        {
          id: 9004,
          title: "訂單狀態更新",
          content: "訂單 #ORD-2024-998 已出貨，預計明日送達客戶",
          type: "order",
          is_read: false,
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4小時前
          user_id: null
        },
        {
          id: 9005,
          title: "客戶服務請求",
          content: "客戶李大華對訂單 #ORD-2024-995 提出退貨申請",
          type: "customer",
          is_read: true,
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6小時前
          user_id: null
        },
        {
          id: 9006,
          title: "每日銷售報告",
          content: "今日完成 15 筆訂單，總銷售額 $45,200，較昨日增長 12%",
          type: "system",
          is_read: false,
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8小時前
          user_id: null
        },
        {
          id: 9007,
          title: "促銷活動提醒",
          content: "春季促銷活動將於明日結束，目前參與訂單 89 筆",
          type: "system",
          is_read: true,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1天前
          user_id: null
        },
        {
          id: 9008,
          title: "異常訂單警報",
          content: "訂單 #ORD-2025-003 金額異常高（$15,000），請人工審核",
          type: "order",
          is_read: false,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1天前
          user_id: null
        },
        {
          id: 9009,
          title: "新客戶註冊",
          content: "新客戶「王小美」已完成註冊，等級：一般會員",
          type: "customer",
          is_read: false,
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
          user_id: null
        },
        {
          id: 9010,
          title: "月度業績達標",
          content: "恭喜！本月銷售額已達標，目前完成率 105%",
          type: "system",
          is_read: true,
          created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
          user_id: null
        }
      ];

      // 合併並按時間排序（最新的在前）
      const allNotifications = [...apiNotifications, ...fakeNotifications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
      setNotifications(allNotifications);
    } catch {
      message.error("無法載入通知");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    if (readLoadingId) return;
    setReadLoadingId(id);
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      message.success("已標記為已讀");
    } catch {
      message.error("操作失敗");
    } finally {
      setReadLoadingId(null);
    }
  };

  // 根據當前分頁篩選通知
  const getFilteredNotifications = () => {
    if (activeTab === "all") {
      return notifications;
    }
    return notifications.filter((notification) => notification.type === activeTab);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <Card 
      title="所有通知"
      tabList={notificationTabs}
      activeTabKey={activeTab}
      onTabChange={setActiveTab}
    >
      <Spin spinning={loading}>
        {getFilteredNotifications().length === 0 ? (
          <div style={{ textAlign: "center", padding: 20 }}>
            {activeTab === "all" ? "目前沒有通知" : `目前沒有${notificationTabs.find(tab => tab.key === activeTab)?.label}通知`}
          </div>
        ) : (
          <List
            dataSource={getFilteredNotifications()}
            renderItem={(item) => (
              <List.Item
                style={{ background: item.is_read ? "#fff" : "#e6f7ff", cursor: "pointer" }}
                onClick={() => !item.is_read && handleMarkAsRead(item.id)}
              >
                <List.Item.Meta
                  title={
                    <>
                      <Text strong>{item.title}</Text>{" "}
                      <Tag color={item.is_read ? "default" : "blue"}>
                        {item.is_read ? "已讀" : "未讀"}
                      </Tag>
                      <Tag color={
                        item.type === "order" ? "green" :
                        item.type === "system" ? "orange" :
                        item.type === "customer" ? "purple" : "default"
                      }>
                        {notificationTabs.find(tab => tab.key === item.type)?.label || item.type}
                      </Tag>
                    </>
                  }
                  description={
                    <>
                      <div>{item.content}</div>
                      <div style={{ fontSize: 12, color: "#999" }}>
                        {new Date(item.created_at).toLocaleString("zh-TW", { hour12: false })}
                      </div>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Spin>
    </Card>
  );
};

export default NotificationPage;
