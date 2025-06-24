import "./NotificationDropdown.css";
import React, { useState } from "react";
import { Card, List, Badge, Button } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { Notification } from "../api/notifications";

dayjs.extend(relativeTime);

const notificationTabs = [
  { key: "all", label: "全部" },
  { key: "order", label: "訂單" },
  { key: "system", label: "系統" },
  { key: "customer", label: "客服" },
];

interface Props {
  theme: "light" | "dark";
  notifications: Notification[];
  onRead: (id: number, link?: string) => void;
  onMarkAllRead: () => void;
  onViewAll: () => void;
}

const NotificationDropdown: React.FC<Props> = ({
  theme,
  notifications,
  onRead,
  onMarkAllRead,
  onViewAll,
}) => {
  const [tabKey, setTabKey] = useState("all");

  // 依類型篩選
  const filtered =
    tabKey === "all"
      ? notifications
      : notifications.filter((n) => n.type === tabKey);

  return (
    <Card
      className={`custom-notification-dropdown ${theme}`}
      style={{
        width: 360,
        borderRadius: 16,
        boxShadow: "0 6px 32px rgba(0,0,0,0.3)",
        padding: 0,
      }}
      bodyStyle={{ padding: 0 }}
      tabList={notificationTabs}
      activeTabKey={tabKey}
      onTabChange={setTabKey}
      extra={
        <Button
          type="link"
          size="small"
          onClick={onMarkAllRead}
          style={{ marginRight: 8 }}
        >
          全部標為已讀
        </Button>
      }
    >
      <List
        dataSource={filtered}
        locale={{ emptyText: "暫無通知" }}
        renderItem={(item) => (
          <List.Item
            className={item.is_read ? "" : "unread"}
            style={{
              padding: "12px 16px",
              borderBottom:
                theme === "dark" ? "1px solid #31343f" : "1px solid #eee",
              cursor: "pointer",
            }}
            onClick={() => onRead(item.id)}
          >
            <List.Item.Meta
              title={
                <span>
                  {!item.is_read && (
                    <Badge
                      color={theme === "dark" ? "#13c2c2" : "#177ddc"}
                      dot
                      style={{ marginRight: 8, verticalAlign: "-2px" }}
                    />
                  )}
                  {item.title}
                  {!item.is_read && (
                    <span className="unread-label">未讀</span>
                  )}
                </span>
              }
              description={
                <span>
                  {item.content}
                  <span style={{ float: "right", fontSize: 11, color: "#aaa" }}>
                    {dayjs(item.created_at).fromNow()}
                  </span>
                </span>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <a onClick={onViewAll}>查看全部通知</a>
      </div>
    </Card>
  );
};

export default NotificationDropdown;
