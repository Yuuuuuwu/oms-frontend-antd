import {
  DashboardOutlined,
  OrderedListOutlined,
  AppstoreOutlined,
  UsergroupAddOutlined,
  BellOutlined,
  UserOutlined,
} from "@ant-design/icons";

export function getMenuData(user: any) {
  const commonItems = [
    { path: "/shop", name: "商品瀏覽", icon: <AppstoreOutlined /> },
    { path: "/cart", name: "購物車", icon: <AppstoreOutlined /> },
  ];
  let extraItems: any[] = [];
  if (user.role === "admin" || user.role === "seller") {
    extraItems = [
      { path: "/dashboard", name: "儀表板", icon: <DashboardOutlined /> },
      { path: "/orders", name: "訂單管理", icon: <OrderedListOutlined /> },
      { path: "/products", name: "商品管理", icon: <AppstoreOutlined /> },
      { path: "/customers", name: "客戶管理", icon: <UsergroupAddOutlined /> },
      ...(user.role === "admin" ? [{ path: "/users", name: "使用者管理", icon: <UserOutlined /> }] : []),
    ];
  } else if (user.role === "customer") {
    extraItems = [{ path: "/orders", name: "我的訂單", icon: <OrderedListOutlined /> }];
  }
  const notifyItem =
    user.role && user.role !== "guest"
      ? [{ path: "/notifications", name: "通知", icon: <BellOutlined /> }]
      : [];
  return [...commonItems, ...extraItems, ...notifyItem];
}
