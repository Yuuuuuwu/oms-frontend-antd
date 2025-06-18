import React, { useEffect, useState } from "react";
import { Card, List, message } from "antd";
import axios from "axios";

const NotificationPage: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data);
    } catch (error) {
      message.error("無法載入通知");
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axios.post(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, is_read: true } : notif
        )
      );
      message.success("通知已標記為已讀");
    } catch (error) {
      message.error("無法標記通知為已讀");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <Card title="所有通知">
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{ background: item.is_read ? "#fff" : "#e6f7ff" }}
            onClick={() => markAsRead(item.id)}
          >
            <List.Item.Meta title={item.title} description={item.description} />
            {!item.is_read && <span style={{ color: "#1890ff" }}>未讀</span>}
          </List.Item>
        )}
      />
    </Card>
  );
};

export default NotificationPage;
