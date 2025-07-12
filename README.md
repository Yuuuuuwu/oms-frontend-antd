# 🎨 OMS 訂單管理系統 - 前端應用

![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.25.4-red.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)

現代化的訂單管理系統前端應用，基於 React + TypeScript + Ant Design 構建，提供直觀易用的管理界面。

### 目前此前端已部署到Render雲端平台，可透過下方測試帳號進行測試。

此為免費方案部署，速度較慢，若有loading較久的情況，請稍後再嘗試，謝謝。

網址:https://oms-frontend-ixkl.onrender.com

### 預設測試帳號

```
管理員帳號:
Email: admin@example.com
Password: AdminPassword123!

銷售員帳號:
Email: seller@example.com
Password: SellerPassword123!

客戶帳號:
Email: customer@example.com
Password: CustomerPassword123!
```

## 📋 目錄

- [功能特色](#-功能特色)
- [技術架構](#-技術架構)
- [快速開始](#-快速開始)
- [專案結構](#-專案結構)

## ✨ 功能特色

### 🔐 身份驗證
- 用戶登入/登出功能
- JWT Token 自動管理
- 角色權限控制
- 自動 Token 刷新

### 📊 儀表板
- 銷售數據統計
- 訂單狀態總覽
- 圖表數據視覺化
- 即時業績監控

### 👥 用戶管理
- 用戶列表與搜索
- 用戶資料編輯
- 角色權限管理
- 用戶狀態控制

### 📦 商品管理
- 商品列表展示
- 商品分類管理
- 庫存狀況監控
- 商品編輯功能

### 🛒 訂單管理
- 訂單列表與篩選
- 訂單詳情查看
- 訂單狀態更新
- 訂單建立流程

### 👤 客戶管理
- 客戶資料維護
- 客戶訂單記錄
- 客戶標籤管理
- 客戶關係追蹤

### 💳 支付管理
- 支付記錄查看
- 支付狀態追蹤
- 退款處理
- 支付統計報表

### 🔔 通知系統
- 即時通知提醒
- 通知歷史記錄
- 通知狀態管理
- 自動通知推送

### 🛍️ 購物功能
- 商品瀏覽
- 購物車管理
- 結帳流程
- 訂單追蹤

## 🏗️ 技術架構

### 核心框架
- **React 18.3.1** - 現代化前端框架
- **TypeScript 5.8.3** - 類型安全的 JavaScript
- **Vite 5.4.19** - 快速建構工具
- **React Router Dom 6.30.1** - 客戶端路由

### UI 框架
- **Ant Design 5.25.4** - 企業級 UI 設計語言
- **Ant Design Pro Components 2.8.7** - 進階業務組件
- **Ant Design Icons 5.6.1** - 圖標庫
- **Ant Design Charts 2.3.0** - 數據視覺化

### 狀態管理
- **React Context API** - 全局狀態管理
- **useState/useEffect** - 本地狀態管理
- **Custom Hooks** - 可重用邏輯

### 數據處理
- **Axios 1.9.0** - HTTP 客戶端
- **Day.js 1.11.13** - 日期處理庫

### 開發工具
- **Vitest 3.2.3** - 單元測試框架
- **Testing Library** - React 組件測試
- **ESLint** - 代碼質量檢查



## 📁 專案結構

```
oms-frontend-antd/
├── public/                     # 靜態資源
│   ├── logo.png
│   ├── logo.svg
│   └── _redirects             # Render 部署路由配置
├── src/                       # 源代碼
│   ├── api/                   # API 服務層
│   │   ├── auth.ts           # 認證 API
│   │   ├── customers.ts      # 客戶 API
│   │   ├── notifications.ts  # 通知 API
│   │   ├── orders.ts         # 訂單 API
│   │   ├── payments.ts       # 支付 API
│   │   ├── products.ts       # 商品 API
│   │   ├── reports.ts        # 報表 API
│   │   └── users.ts          # 用戶 API
│   ├── assets/               # 靜態資源
│   │   └── react.svg
│   ├── components/           # 可重用組件
│   │   ├── LangSwitcher.tsx  # 語言切換器
│   │   └── NotificationDropdown.tsx  # 通知下拉選單
│   ├── contexts/             # React Context
│   │   └── ThemeLangContext.tsx      # 主題語言上下文
│   ├── hooks/                # 自定義 Hooks
│   │   └── useNotifications.ts       # 通知 Hook
│   ├── layouts/              # 版面配置
│   │   ├── MainLayout.tsx    # 主要版面
│   │   └── menuData.tsx      # 菜單配置
│   ├── pages/                # 頁面組件
│   │   ├── Auth/             # 認證相關頁面
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── ForgotPassword.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── Dashboard/        # 儀表板
│   │   │   └── index.tsx
│   │   ├── User/             # 用戶管理
│   │   │   └── index.tsx
│   │   ├── Product/          # 商品管理
│   │   │   ├── index.tsx
│   │   │   └── CategoryManager.tsx
│   │   ├── Order/            # 訂單管理
│   │   │   ├── index.tsx
│   │   │   ├── Edit.tsx
│   │   │   ├── OrderCreate.tsx
│   │   │   └── OrderDetail.tsx
│   │   ├── Customer/         # 客戶管理
│   │   │   └── index.tsx
│   │   ├── Payment/          # 支付管理
│   │   │   ├── index.tsx
│   │   │   └── PaymentResult.tsx
│   │   ├── Shop/             # 購物功能
│   │   │   ├── index.tsx
│   │   │   └── ProductDetail.tsx
│   │   ├── Cart/             # 購物車
│   │   │   └── index.tsx
│   │   ├── Checkout/         # 結帳流程
│   │   │   ├── Process.tsx
│   │   │   └── Preview.tsx
│   │   ├── Notifications/    # 通知中心
│   │   │   └── index.tsx
│   │   ├── Report/           # 報表中心
│   │   │   └── index.tsx
│   │   ├── Profile/          # 個人資料
│   │   │   └── index.tsx
│   │   └── Landing.tsx       # 登陸頁面
│   ├── types/                # TypeScript 類型定義
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Order.ts
│   │   ├── Customer.ts
│   │   ├── Payment.ts
│   │   ├── Notification.ts
│   │   └── Report.ts
│   ├── utils/                # 工具函數
│   │   ├── auth.ts           # 認證工具
│   │   ├── axiosWithAuth.ts  # 帶認證的 Axios
│   │   └── env.ts            # 環境變數
│   ├── App.tsx               # 主應用組件
│   ├── main.tsx              # 應用入口
│   └── vite-env.d.ts         # Vite 類型定義
├── build.sh                  # Render 建置腳本
├── package.json              # 依賴配置
├── tsconfig.json             # TypeScript 配置
├── vite.config.ts            # Vite 配置
└── README.md                 # 說明文檔
```


**OMS 訂單管理系統前端** - 現代化、響應式、易用的管理界面！
