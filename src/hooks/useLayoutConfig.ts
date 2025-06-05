import { useThemeLang } from "../contexts/ThemeLangContext";
import {
  DashboardOutlined,
  OrderedListOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";

export const useLayoutConfig = (user: { role?: string }) => {
  const { theme, locales, lang, setLang, setTheme } = useThemeLang();

  // 顯式定義 ProLayout 支援的 navTheme 類型
  const navTheme: "light" | "realDark" =
    theme === "dark" ? "realDark" : "light";

  // 使用 icon 函式參考而不是 JSX 表達式
  const menuData =
    user?.role === "admin"
      ? [
          { path: "/dashboard", name: "儀表板", icon: DashboardOutlined },
          { path: "/orders", name: "訂單管理", icon: OrderedListOutlined },
          { path: "/products", name: "商品管理", icon: AppstoreOutlined },
          {
            path: "/customers",
            name: "客戶管理",
            icon: UsergroupAddOutlined,
          },
        ]
      : [
          { path: "/dashboard", name: "儀表板", icon: DashboardOutlined },
          { path: "/orders", name: "訂單管理", icon: OrderedListOutlined },
        ];

  return {
    navTheme,
    theme,
    setTheme,
    lang,
    setLang,
    locales,
    menuData,
  };
};
