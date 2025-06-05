import React, { useState } from "react";
import { Card, List, Badge, Button } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { NotificationType } from "../types/NotificationType";
import { useThemeLang } from "../contexts/ThemeLangContext";

// 擴充 dayjs 支援 relativeTime（幾分鐘前/小時前）
dayjs.extend(relativeTime);

// 通知分類tabs
const notificationTabs = [
  { key: "all", label: "全部" },
  { key: "order", label: "訂單" },
  { key: "system", label: "系統" },
  { key: "customer", label: "客服" },
];

// Props 型別定義，theme 由父層(MainLayout)傳進
interface Props {
  theme: "light" | "dark";
  notifications: NotificationType[];
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
  // 當前顯示tab
  const [tabKey, setTabKey] = useState("all");

  // 過濾通知（依據tab）
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
        boxShadow: "0 6px 32px rgba(0,0,0,0.30)",
        padding: 0,
      }}
      bodyStyle={{ padding: 0 }}
      tabList={notificationTabs}
      activeTabKey={tabKey}
      onTabChange={setTabKey}
      extra={
        // 標為已讀按鈕
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
            className={item.read ? "" : "unread"}
            style={{
              padding: "12px 16px",
              borderBottom:
                theme === "dark" ? "1px solid #31343f" : "1px solid #eee",
              cursor: "pointer",
              position: "relative",
            }}
            onClick={() => onRead(item.id, item.link)}
          >
            <List.Item.Meta
              // 標題：未讀有藍綠色圓點+文字，已讀無
              title={
                <span>
                  {!item.read && (
                    <Badge
                      color={theme === "dark" ? "#13c2c2" : "#177ddc"}
                      dot
                      style={{
                        marginRight: 8,
                        verticalAlign: "-2px",
                      }}
                    />
                  )}
                  {item.title}
                  {/* 未讀標籤，和圓點有間距，不會擠在一起 */}
                  {!item.read && <span className="unread-label">未讀</span>}
                </span>
              }
              // 描述 + 右側時間
              description={
                <span>
                  {item.description}
                  <span
                    style={{
                      float: "right",
                      fontSize: 11,
                      color: "#aaa",
                    }}
                  >
                    {item.time.fromNow()}
                  </span>
                </span>
              }
            />
          </List.Item>
        )}
      />
      {/* 查看全部通知連結 */}
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <a onClick={onViewAll}>查看全部通知</a>
      </div>
    </Card>
  );
};

export default NotificationDropdown;
