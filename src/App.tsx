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
import Userpage from "./pages/User";
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
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Landing頁不包MainLayout，其餘頁面包MainLayout */}
          <Route
            path="*"
            element={
              <MainLayout>
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="shop/:id" element={<ProductDetail />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="orders" element={<RequireAuth><OrderPage /></RequireAuth>} />
                  <Route path="users" element={<RequireAuth><Userpage /></RequireAuth>} />
                  <Route path="payments" element={<RequireAuth><PaymentPage /></RequireAuth>} />
                  <Route path="payments/payment_result" element={<PaymentResult />} />
                  <Route path="orders/:id" element={<RequireAuth><OrderDetail /></RequireAuth>} />
                  <Route path="orders/:id/edit" element={<RequireAuth><OrderEdit /></RequireAuth>} />
                  <Route path="orders/new" element={<RequireAuth><OrderEdit /></RequireAuth>} />
                  <Route path="products" element={<RequireAuth><ProductPage /></RequireAuth>} />
                  <Route path="customers" element={<RequireAuth><CustomerPage /></RequireAuth>} />
                  <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
                  <Route path="checkout/preview" element={<CheckoutPreview />} />
                  <Route path="checkout/process" element={<CheckoutProcess />} />
                  <Route path="payment-notification" element={<PaymentNotification />} />
                  <Route path="notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
                  <Route path="report" element={<RequireAuth><ReportPage /></RequireAuth>} />
                  <Route path="products/category-manager" element={<RequireAuth><CategoryManagerPage /></RequireAuth>} />
                  <Route path="orders/create" element={<RequireAuth><OrderCreatePage /></RequireAuth>} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </MainLayout>
            }
          />
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
