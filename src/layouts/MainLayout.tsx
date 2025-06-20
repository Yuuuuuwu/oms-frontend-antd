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
  UserOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import NotificationDropdown from "../components/NotificationDropdown";
import type { NotificationType } from "../types/NotificationType";
import { useThemeLang } from "../contexts/ThemeLangContext";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import type { MenuDataItem } from "@ant-design/pro-components";

// 擴充 dayjs 支援 relativeTime
dayjs.extend(relativeTime);

// 讓 MainLayout 支援 children
const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
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
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  // 從後端取得通知
  const fetchNotifications = async () => {
    try {
      const res = await fetchWithAuth("/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(
          data.map((n: any) => ({
            ...n,
            time: dayjs(n.created_at),
            read: n.is_read,
          }))
        );
      }
    } catch {}
  };
  React.useEffect(() => {
    if (user?.role && user?.role !== "guest") fetchNotifications();
  }, [user?.role]);

  // 單筆設為已讀
  const handleRead = async (id: number, link?: string) => {
    try {
      await fetchWithAuth(`/notifications/${id}/read`, { method: "POST" });
      setNotifications((nots) =>
        nots.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      if (link) navigate(link);
    } catch {
      if (link) navigate(link);
    }
  };

  // 全部設為已讀
  const handleMarkAllRead = async () => {
    await Promise.all(
      notifications
        .filter((n) => !n.read)
        .map((n) =>
          fetchWithAuth(`/notifications/${n.id}/read`, { method: "POST" })
        )
    );
    setNotifications((nots) => nots.map((n) => ({ ...n, read: true })));
  };

  // 查看全部通知
  const handleViewAll = () => navigate("/notifications");

  // 依角色動態產生側邊選單
  let menuData: MenuDataItem[] = [];
  if (user?.role === "admin") {
    menuData = [
      { path: "/dashboard", name: "儀表板", icon: <DashboardOutlined /> },
      { path: "/shop", name: "商品瀏覽", icon: <AppstoreOutlined /> },
      { path: "/cart", name: "購物車", icon: <AppstoreOutlined /> },
      { path: "/orders", name: "訂單管理", icon: <OrderedListOutlined /> },
      { path: "/products", name: "商品管理", icon: <AppstoreOutlined /> },
      {
        path: "/customers",
        name: "客戶管理",
        icon: <UsergroupAddOutlined />,
      },
      {
        path: "/users",
        name: "使用者管理",
        icon: <UserOutlined />,
      },
      { path: "/notifications", name: "通知", icon: <BellOutlined /> },
    ];
  } else if (user?.role === "seller") {
    menuData = [
      { path: "/dashboard", name: "儀表板", icon: <DashboardOutlined /> },
      { path: "/shop", name: "商品瀏覽", icon: <AppstoreOutlined /> },
      { path: "/cart", name: "購物車", icon: <AppstoreOutlined /> },
      { path: "/orders", name: "訂單管理", icon: <OrderedListOutlined /> },
      { path: "/products", name: "商品管理", icon: <AppstoreOutlined /> },
      {
        path: "/customers",
        name: "客戶管理",
        icon: <UsergroupAddOutlined />,
      },
      { path: "/notifications", name: "通知", icon: <BellOutlined /> },
    ];
  } else if (user?.role === "customer") {
    menuData = [
      { path: "/dashboard", name: "儀表板", icon: <DashboardOutlined /> },
      { path: "/shop", name: "商品瀏覽", icon: <AppstoreOutlined /> },
      { path: "/cart", name: "購物車", icon: <AppstoreOutlined /> },
      { path: "/orders", name: "我的訂單", icon: <OrderedListOutlined /> },
      { path: "/notifications", name: "通知", icon: <BellOutlined /> },
    ];
  } else {
    // guest
    menuData = [
      { path: "/shop", name: "商品瀏覽", icon: <AppstoreOutlined /> },
      { path: "/cart", name: "購物車", icon: <AppstoreOutlined /> },
    ];
  }

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

    // 通知下拉（僅登入者可見）
    user?.role && user?.role !== "guest" && (
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
        <Badge count={notifications.filter((n) => !n.read).length} size="small">
          <BellOutlined style={{ fontSize: 22, cursor: "pointer" }} />
        </Badge>
      </Dropdown>
    ),
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
      menuItemRender={(item, dom) =>
        // 未登入時點logo或標題回landing
        (!user?.role || user?.role === "guest") && (item.path === "/dashboard" || item.path === "/" || item.path === undefined)
          ? <a href="/">{dom}</a>
          : <a href={item.path}>{dom}
        </a>
      }
      avatarProps={
        user?.role && user?.role !== "guest"
          ? {
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
            }
          : undefined
      }
      token={theme === "dark" ? darkToken : lightToken}
      actionsRender={() =>
        user?.role && user?.role !== "guest"
          ? actions
          : [actions[0], actions[1]]
      }
    >
      <PageContainer>
        {children ? children : <Outlet />}
      </PageContainer>
    </ProLayout>
  );
};

export default MainLayout;
