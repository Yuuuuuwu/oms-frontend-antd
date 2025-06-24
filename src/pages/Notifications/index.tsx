import React, { useEffect, useState } from "react";
import { Card, List, message, Spin, Typography, Tag } from "antd";
import type { Notification } from "../../types/Notification";
import {
  fetchNotifications,
  markNotificationRead
} from "../../api/notifications";


const { Text } = Typography;

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [readLoadingId, setReadLoadingId] = useState<number | null>(null); // 避免重複點擊

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetchNotifications();
      if (Array.isArray(res)) {
        setNotifications(res);
      } else {
        setNotifications([]);
      }
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

  useEffect(() => {
    loadNotifications();
  }, []);

  return (
    <Card title="所有通知">
      <Spin spinning={loading}>
        {notifications.length === 0 ? (
          <div style={{ textAlign: "center", padding: 20 }}>目前沒有通知</div>
        ) : (
          <List
            dataSource={notifications}
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
