import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeLangProvider, useThemeLang } from "./contexts/ThemeLangContext";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import OrderList from "./pages/Order";
import OrderDetail from "./pages/Order/Detail";
import OrderEdit from "./pages/Order/Edit";
import ProductPage from "./pages/Product";
import CustomerPage from "./pages/Customer";
import Profile from "./pages/Profile";
import "./App.css";
<<<<<<< HEAD
=======
import UserList from "./pages/User/UserList.tsx";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
>>>>>>> 20d2f55 (新增忘記密碼與重設密碼功能，更新登入與註冊頁面以支援 email 登入)

// 登入驗證元件
function RequireAuth({ children }: { children: React.ReactNode }) {
  const user = localStorage.getItem("oms-user");
  if (!user) {
    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}

// 全域主題/語言自動套用 ConfigProvider
const AppInner: React.FC = () => {
  const { theme, lang, locales } = useThemeLang();

  const antdThemeConfig =
    theme === "dark"
      ? {
          algorithm: antdTheme.darkAlgorithm,
          token: { colorBgBase: "#222", colorTextBase: "#e6e6e6" },
        }
      : {
          algorithm: antdTheme.defaultAlgorithm,
        };

  return (
    <ConfigProvider locale={locales[lang].antd} theme={antdThemeConfig}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
<<<<<<< HEAD
=======
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

>>>>>>> 20d2f55 (新增忘記密碼與重設密碼功能，更新登入與註冊頁面以支援 email 登入)
          <Route
            path="/"
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="orders" element={<OrderList />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="orders/:id/edit" element={<OrderEdit />} />
            <Route path="orders/new" element={<OrderEdit isNew={true} />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="customers" element={<CustomerPage />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

const App: React.FC = () => (
  <ThemeLangProvider>
    <AppInner />
  </ThemeLangProvider>
);

export default App;
