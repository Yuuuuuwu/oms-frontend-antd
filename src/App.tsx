import React from "react";
import { BrowserRouter , Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider, theme as antdTheme } from "antd";
import { ThemeLangProvider, useThemeLang } from "./contexts/ThemeLangContext";
import MainLayout from "./layouts/MainLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Dashboard from "./pages/Dashboard";
import OrderPage from "./pages/Order";
import UserList from "./pages/User/UserList";
import PaymentPage from "./pages/Payment";
import PaymentResult from "./pages/Payment/PaymentResult";
import OrderDetail from "./pages/Order/OrderDetail";
import OrderEdit from "./pages/Order/Edit";
import ProductPage from "./pages/Product"; // # 確認匯入 ProductPage
import CustomerPage from "./pages/Customer";
import Profile from "./pages/Profile";
import "./App.css";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import CartPage from "./pages/Cart";
import ShopPage from "./pages/Shop";
import ProductDetail from "./pages/Shop/ProductDetail";
import CheckoutPreview from "./pages/Checkout/Preview";
import CheckoutProcess from "./pages/Checkout/Process";
import PaymentNotification from "./pages/PaymentNotification";
import NotificationsPage from "./pages/Notifications";
import ReportPage from "./pages/Report";
import CategoryManagerPage from "./pages/Product/CategoryManager";
import OrderCreatePage from "./pages/Order/OrderCreate";

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
  const { lang, locales } = useThemeLang();

  const antdThemeConfig = {
    token: {
      colorPrimary: "#1890ff",
      colorBgContainer: "#ffffff",
      colorText: "#000000",
    },
  };

  return (
    <ConfigProvider locale={locales[lang].antd} theme={antdThemeConfig}>
      <BrowserRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/*"
              element={
                <RequireAuth>
                  <Routes>
                    <Route path="shop" element={<ShopPage />} />
                    <Route path="shop/:id" element={<ProductDetail />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="cart" element={<CartPage />} />
                    <Route path="orders" element={<OrderPage />} />
                    <Route path="users" element={<UserList />} />
                    <Route path="payments" element={<PaymentPage />} />
                    <Route path="payments/payment_result" element={<PaymentResult />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                    <Route path="orders/:id/edit" element={<OrderEdit />} />
                    <Route path="orders/new" element={<OrderEdit />} />
                    <Route path="products" element={<ProductPage />} />
                    <Route path="customers" element={<CustomerPage />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="checkout/preview" element={<CheckoutPreview />} />
                    <Route path="checkout/process" element={<CheckoutProcess />} />
                    <Route path="payment-notification" element={<PaymentNotification />} />
                    <Route path="notifications" element={<NotificationsPage />} />
                    <Route path="report" element={<ReportPage />} />
                    <Route path="products/category-manager" element={<CategoryManagerPage />} />
                    <Route path="orders/create" element={<OrderCreatePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </RequireAuth>
              }
            />
          </Routes>
        </MainLayout>
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
