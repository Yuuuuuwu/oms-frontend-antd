import React from "react";
import { Card, List } from "antd";

const notifications = [
  {
    id: 1,
    title: "新訂單通知",
    description: "您有一筆新的訂單需要處理",
    read: false,
  },
  {
    id: 2,
    title: "系統公告",
    description: "本週六凌晨02:00~04:00系統維護",
    read: false,
  },
  {
    id: 3,
    title: "客戶留言",
    description: "王小明：請儘快出貨，謝謝！",
    read: true,
  },
];

const NotificationPage: React.FC = () => (
  <Card title="所有通知">
    <List
      dataSource={notifications}
      renderItem={(item) => (
        <List.Item style={{ background: item.read ? "#fff" : "#e6f7ff" }}>
          <List.Item.Meta title={item.title} description={item.description} />
          {!item.read && <span style={{ color: "#1890ff" }}>未讀</span>}
        </List.Item>
      )}
    />
  </Card>
);

export default NotificationPage;
