import React, { useState } from "react";
import { ProLayout, PageContainer } from "@ant-design/pro-components";
import { Menu, Badge, Dropdown, Popover } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import {
  DashboardOutlined,
  OrderedListOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  BellOutlined,
  BulbOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotificationDropdown from "../components/NotificationDropdown";
import type { NotificationType } from "../types/NotificationType";
import { useThemeLang } from "../contexts/ThemeLangContext";

// 擴充 dayjs 支援 relativeTime
dayjs.extend(relativeTime);

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("oms-user") || "{}");

  // 取得主題、語言
  const { theme, setTheme, lang, setLang, locales } = useThemeLang();

  // ProLayout 的 navTheme 只接受 "realDark" 或 "light"
  const navTheme = theme === "dark" ? "realDark" : "light";

  // 根據主題切換 ProLayout 自訂 token
  const lightToken = {
    header: {
      colorBgHeader: "#fff",
      colorTextMenu: "#222",
      colorTextMenuSelected: "#177ddc",
    },
    sider: {
      colorBgSider: "#f6f8fa",
      colorBgMenuItemSelected: "#e6f4ff",
      colorTextMenu: "#222",
      colorTextMenuSelected: "#177ddc",
    },
  };

  const darkToken = {
    header: {
      colorBgHeader: "#23262f",
      colorTextMenu: "#f2f3f5",
      colorTextMenuSelected: "#13c2c2",
    },
    sider: {
      colorBgSider: "#23262f",
      colorBgMenuItemSelected: "#31343f",
      colorTextMenu: "#f2f3f5",
      colorTextMenuSelected: "#13c2c2",
    },
  };

  // 假通知資料
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: 1,
      title: "新訂單通知",
      description: "您有一筆新的訂單需要處理",
      read: false,
      type: "order",
      link: "/orders/1",
      time: dayjs().subtract(5, "minute"),
    },
    {
      id: 2,
      title: "系統公告",
      description: "本週六凌晨02:00~04:00系統維護",
      read: false,
      type: "system",
      link: "/dashboard",
      time: dayjs().subtract(1, "hour"),
    },
    {
      id: 3,
      title: "客戶留言",
      description: "王小明：請儘快出貨，謝謝！",
      read: true,
      type: "customer",
      link: "/customers",
      time: dayjs().subtract(3, "hour"),
    },
  ]);

  // 未讀數量
  const unreadCount = notifications.filter((n) => !n.read).length;

  // 單筆設為已讀
  const handleRead = (id: number, link?: string) => {
    setNotifications((nots) =>
      nots.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    if (link) navigate(link);
  };

  // 全部設為已讀
  const handleMarkAllRead = () =>
    setNotifications((nots) => nots.map((n) => ({ ...n, read: true })));

  // 查看全部通知
  const handleViewAll = () => navigate("/notifications");

  // 側邊選單資料
  const menuData =
    user?.role === "admin"
      ? [
          { path: "/dashboard", name: "儀表板", icon: <DashboardOutlined /> },
          { path: "/orders", name: "訂單管理", icon: <OrderedListOutlined /> },
          { path: "/products", name: "商品管理", icon: <AppstoreOutlined /> },
          {
            path: "/customers",
            name: "客戶管理",
            icon: <UsergroupAddOutlined />,
          },
        ]
      : [
          { path: "/dashboard", name: "儀表板", icon: <DashboardOutlined /> },
          { path: "/orders", name: "訂單管理", icon: <OrderedListOutlined /> },
        ];

  // 語言切換 popover
  const langPopover = (
    <div>
      {Object.entries(locales).map(([key, v]) => (
        <button
          key={key}
          style={{
            margin: 4,
            background: lang === key ? "#1677ff" : "#fff",
            color: lang === key ? "#fff" : "#222",
            border: "1px solid #e0e0e0",
            borderRadius: 4,
            padding: "2px 8px",
            cursor: "pointer",
          }}
          onClick={() => setLang(key as any)}
        >
          {v.label}
        </button>
      ))}
    </div>
  );

  // 右上角操作列
  const actions = [
    // 語言切換
    <Popover
      key="lang"
      content={langPopover}
      placement="bottomRight"
      trigger="click"
    >
      <GlobalOutlined
        style={{ fontSize: 20, cursor: "pointer", marginRight: 20 }}
      />
    </Popover>,

    // 主題切換
    <span
      style={{ cursor: "pointer", marginRight: 20, fontSize: 20 }}
      key="theme"
      title="切換主題"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <BulbOutlined />
    </span>,

    // 通知下拉
    <Dropdown
      key="notice"
      overlay={
        <NotificationDropdown
          theme={theme}
          notifications={notifications}
          onRead={handleRead}
          onMarkAllRead={handleMarkAllRead}
          onViewAll={handleViewAll}
        />
      }
      placement="bottomRight"
      trigger={["click"]}
      arrow
    >
      <Badge count={unreadCount} size="small">
        <BellOutlined style={{ fontSize: 22, cursor: "pointer" }} />
      </Badge>
    </Dropdown>,
  ];

  return (
    <ProLayout
      title="訂單管理系統"
      logo="logo.png"
      fixSiderbar
      layout="mix"
      splitMenus={false}
      navTheme={navTheme}
      route={{ routes: menuData }}
      menuItemRender={(item, dom) => <a href={item.path}>{dom}</a>}
      // 頭像點擊可進個人中心或登出
      avatarProps={{
        src:
          "https://api.dicebear.com/7.x/miniavs/svg?seed=" +
          (user?.username || "user"),
        title: user?.username,
        size: "small",
        render: (props, dom) => (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item key="profile" onClick={() => navigate("/profile")}>
                  個人中心
                </Menu.Item>
                <Menu.Item
                  key="logout"
                  danger
                  onClick={() => {
                    localStorage.removeItem("oms-user");
                    navigate("/login");
                  }}
                >
                  登出
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
            trigger={["click"]}
          >
            {dom}
          </Dropdown>
        ),
      }}
      token={theme === "dark" ? darkToken : lightToken}
      actionsRender={() => actions}
    >
      <PageContainer>
        <Outlet />
      </PageContainer>
    </ProLayout>
  );
};

export default MainLayout;
