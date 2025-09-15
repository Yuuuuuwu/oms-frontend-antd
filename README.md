# 🎨 OMS 訂單管理系統 - 前端應用

![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.25.4-red.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)

現代化的訂單管理系統前端，基於 React + TypeScript + Ant Design，支援多角色、儀表板、商品/訂單/支付/客戶/通知/購物等完整功能，並具備完善分層、測試與容器化部署。

---

### 目前此前端已部署到 Render 雲端平台，可透過下方測試帳號進行測試。

此為免費方案部署，伺服器會有閒置模式，初次開啟需要等伺服器啟動，若有 loading 情況請耐心等候，謝謝。

後端網址:https://oms-backend-d0yc.onrender.com

請先開啟後端網址，待後端啟動後顯示 Hello, Order Management System，即可開啟下方前端網頁進行測試。

前端網址:https://oms-frontend-ixkl.onrender.com

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

---

## 📋 目錄

- [功能特色](#功能特色)
- [技術架構](#技術架構)
- [快速開始](#快速開始)
- [專案結構](#專案結構)

---

## ✨ 功能特色

### 🔐 身份驗證

- JWT 登入/登出、自動刷新
- 多角色權限（admin/seller/customer）
- 忘記/重設密碼

### 📊 儀表板

- 銷售統計、訂單狀態、圖表、即時監控

### 👥 用戶管理

- 用戶 CRUD、角色分配、狀態控管

### 📦 商品與分類管理

- 商品 CRUD、分類巢狀、庫存、促銷、圖片

### 🛒 訂單管理

- 訂單 CRUD、狀態流轉、明細、批次操作

### 💳 支付管理

- 支付紀錄、狀態追蹤、退款、ECPay 整合

### 👤 客戶管理

- 客戶 CRUD、標籤、訂單、忠誠度

### 🔔 通知系統

- 即時推播、歷史、狀態管理

### 🛍️ 購物功能

- 商品瀏覽、購物車、結帳、訂單追蹤

---

## 🏗️ 技術架構

- **React 18.3.1** / **TypeScript 5.8.3** / **Vite 5.4.19**
- **Ant Design 5.25.4** / Pro Components / Charts
- **React Router Dom 6.30.1**
- **Axios** / **Day.js**
- **React Context API** / Custom Hooks
- **Vitest** / **Testing Library**
- **Docker** / Nginx 靜態部署

---

## 🚀 快速開始

```bash
# 安裝依賴
npm install
# 啟動開發伺服器
npm run dev
# 執行單元測試
npm run test
# 打包靜態檔案
npm run build
```

---

## 📁 專案結構

```
oms-frontend-antd/
├── public/         # 靜態資源
├── src/
│   ├── api/        # API 服務
│   ├── assets/     # 靜態圖示
│   ├── components/ # 可重用元件
│   ├── contexts/   # 全域狀態
│   ├── hooks/      # 自定義 hooks
│   ├── layouts/    # 版面配置
│   ├── pages/      # 各功能頁面
│   ├── types/      # 型別定義
│   ├── utils/      # 工具
│   ├── App.tsx     # 主組件
│   └── main.tsx    # 入口
├── package.json    # 依賴
├── Dockerfile      # 容器
├── vite.config.ts  # Vite 設定
└── README.md
```

---

## 🧪 測試與部署

- `npm run test`：單元/組件測試（Vitest + Testing Library）
- `docker build .`：容器化建置
- 支援 Nginx/Render/雲端靜態部署
