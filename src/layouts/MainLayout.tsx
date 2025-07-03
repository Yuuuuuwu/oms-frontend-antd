import React, { ReactNode } from "react";
import { ProLayout, PageContainer } from "@ant-design/pro-components";
import { Badge, Dropdown, Popover } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import {
  BulbOutlined,
  GlobalOutlined,
  BellOutlined,
} from "@ant-design/icons";
import NotificationDropdown from "../components/NotificationDropdown";
import { useThemeLang } from "../contexts/ThemeLangContext";
import { useNotifications } from "../hooks/useNotifications";
import { getMenuData } from "./menuData";
import LangSwitcher from "../components/LangSwitcher";
import "../components/NotificationDropdown.css";

interface Props {
  children?: ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("oms-user") || "{}");
  const { theme, setTheme, lang, setLang, locales } = useThemeLang();
  const {
    notifications,
    handleRead,
    handleMarkAllRead,
  } = useNotifications(user);

  // AntD ProLayout 主題設定
  const navTheme = theme === "dark" ? "realDark" : "light";
  const lightToken = {
    header: { colorBgHeader: "#fff", colorTextMenu: "#222", colorTextMenuSelected: "#177ddc" },
    sider: { colorBgSider: "#f6f8fa", colorBgMenuItemSelected: "#e6f4ff", colorTextMenu: "#222", colorTextMenuSelected: "#177ddc" },
  };
  const darkToken = {
    header: { colorBgHeader: "#23262f", colorTextMenu: "#f2f3f5", colorTextMenuSelected: "#13c2c2" },
    sider: { colorBgSider: "#23262f", colorBgMenuItemSelected: "#31343f", colorTextMenu: "#f2f3f5", colorTextMenuSelected: "#13c2c2" },
  };

  // 右上角動作按鈕陣列
  const actions = [
    // 語言切換
    <Popover key="lang" content={<LangSwitcher lang={lang} setLang={setLang} locales={locales} />} placement="bottomRight" trigger={["click"]}>
      <GlobalOutlined style={{ fontSize: 20, marginRight: 20, cursor: "pointer" }} />
    </Popover>,

    // 主題切換
    <BulbOutlined
      key="theme"
      style={{ fontSize: 20, marginRight: 20, cursor: "pointer" }}
      title="切換主題"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    />,

    // 通知下拉
    user.role && user.role !== "guest" && (
      <Dropdown
        key="notice"
        popupRender={() => (
          <NotificationDropdown
            theme={theme}
            notifications={notifications}
            onRead={(id, link) => handleRead(id, link, navigate)}
            onMarkAllRead={handleMarkAllRead}
            onViewAll={() => navigate("/notifications")}
          />
        )}
        placement="bottomRight"
        trigger={["click"]}
        arrow
      >
        <Badge count={notifications.filter((n) => !n.is_read).length} size="small">
          <BellOutlined style={{ fontSize: 22, cursor: "pointer" }} />
        </Badge>
      </Dropdown>
    ),

    // 個人頭像下拉
    <Dropdown
      key="avatar"
      menu={{
        items: user.role && user.role !== "guest"
          ? [
              { key: "profile", label: "個人中心", onClick: () => navigate("/profile") },
              { key: "logout", label: "登出", danger: true, onClick: () => {
                  localStorage.removeItem("oms-user");
                  navigate("/login");
                }
              },
            ]
          : [
              { key: "login", label: "登入", onClick: () => navigate("/login") },
              { key: "register", label: "註冊", onClick: () => navigate("/register") },
            ],
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <span style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}>
        <img
          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${user.username || "guest"}`}
          alt="avatar"
          style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8, background: "#eee" }}
        />
        <span style={{ fontWeight: 500 }}>{user.username || "訪客"}</span>
      </span>
    </Dropdown>,
  ];

  // 特定頁面不顯示佈局
  const hideLayout = ["/", "/login", "/register","forgot-password", "/reset-password"];
  if (hideLayout.includes(window.location.pathname)) {
    return <>{children || <Outlet />}</>;
  }

  // 取得 menuData
  const menuData = getMenuData(user);

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
      token={theme === "dark" ? darkToken : lightToken}
      actionsRender={() => actions}
    >
      <PageContainer>
        {children || <Outlet />}
      </PageContainer>
    </ProLayout>
  );
};

export default MainLayout;
