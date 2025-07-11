# 🎨 OMS 訂單管理系統 - 前端應用

![React](https://img.shields.io/badge/React-18.3.1-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Ant Design](https://img.shields.io/badge/Ant%20Design-5.25.4-red.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)

現代化的訂單管理系統前端應用，基於 React + TypeScript + Ant Design 構建，提供直觀易用的管理界面。

## 📋 目錄

- [功能特色](#-功能特色)
- [技術架構](#-技術架構)
- [快速開始](#-快速開始)
- [專案結構](#-專案結構)
- [開發指南](#-開發指南)
- [部署](#-部署)
- [測試](#-測試)
- [貢獻指南](#-貢獻指南)

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

## 🚀 快速開始

### 前置需求
- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器
- 後端 API 服務運行中

### 安裝與啟動

1. **克隆專案**
   ```bash
   git clone <repository-url>
   cd oms-frontend-antd
   ```

2. **安裝依賴**
   ```bash
   npm install
   # 或
   yarn install
   ```

3. **設定環境變數**
   創建 `.env` 檔案：
   ```bash
   # 後端 API URL
   VITE_BACKEND_URL=http://localhost:5000
   
   # 前端 URL
   VITE_FRONTEND_URL=http://localhost:5173
   ```

4. **啟動開發服務器**
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

5. **訪問應用**
   開啟瀏覽器訪問 `http://localhost:5173`

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

## 🛠️ 開發指南

### 可用腳本

```bash
# 開發模式啟動
npm run dev

# 建置生產版本
npm run build

# 預覽生產版本
npm run preview

# 運行測試
npm run test

# 代碼格式檢查
npm run lint
```

### 開發規範

#### 組件開發
```typescript
// 使用 TypeScript 和函數式組件
import React from 'react';
import { Button, Card } from 'antd';

interface Props {
  title: string;
  onAction: () => void;
}

const MyComponent: React.FC<Props> = ({ title, onAction }) => {
  return (
    <Card title={title}>
      <Button onClick={onAction}>
        執行動作
      </Button>
    </Card>
  );
};

export default MyComponent;
```

#### API 調用
```typescript
// 使用統一的 API 服務層
import { axiosWithAuth } from '@/utils/axiosWithAuth';

export const getUserList = async (params: any) => {
  const response = await axiosWithAuth.get('/users', { params });
  return response.data;
};
```

#### 狀態管理
```typescript
// 使用 Context API 進行全局狀態管理
import { useContext } from 'react';
import { ThemeLangContext } from '@/contexts/ThemeLangContext';

const MyComponent = () => {
  const { theme, setTheme } = useContext(ThemeLangContext);
  
  return (
    <div>
      當前主題: {theme}
    </div>
  );
};
```

### 新增頁面

1. **創建頁面組件**
   ```typescript
   // src/pages/NewFeature/index.tsx
   import React from 'react';
   import { Card } from 'antd';
   
   const NewFeature: React.FC = () => {
     return (
       <Card title="新功能">
         {/* 頁面內容 */}
       </Card>
     );
   };
   
   export default NewFeature;
   ```

2. **添加路由配置**
   ```typescript
   // 在主路由中添加
   {
     path: '/new-feature',
     element: <NewFeature />
   }
   ```

3. **更新菜單配置**
   ```typescript
   // src/layouts/menuData.tsx
   {
     key: 'new-feature',
     icon: <Icon />,
     label: '新功能',
     path: '/new-feature'
   }
   ```

### API 整合

1. **創建 API 服務**
   ```typescript
   // src/api/newFeature.ts
   import { axiosWithAuth } from '@/utils/axiosWithAuth';
   
   export const getNewFeatureData = async () => {
     const response = await axiosWithAuth.get('/new-feature');
     return response.data;
   };
   ```

2. **在組件中使用**
   ```typescript
   import { useEffect, useState } from 'react';
   import { getNewFeatureData } from '@/api/newFeature';
   
   const NewFeature = () => {
     const [data, setData] = useState([]);
     
     useEffect(() => {
       const fetchData = async () => {
         try {
           const result = await getNewFeatureData();
           setData(result);
         } catch (error) {
           console.error('獲取數據失敗:', error);
         }
       };
       
       fetchData();
     }, []);
     
     return <div>{/* 渲染數據 */}</div>;
   };
   ```

## 🧪 測試

### 運行測試

```bash
# 運行所有測試
npm run test

# 運行測試並監控文件變化
npm run test:watch

# 運行測試並生成覆蓋率報告
npm run test:coverage
```

### 測試示例

```typescript
// src/pages/Cart/Cart.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Cart from './index';

describe('Cart Component', () => {
  it('should render cart page', () => {
    render(<Cart />);
    expect(screen.getByText('購物車')).toBeInTheDocument();
  });
});
```

## 🚀 部署

### 本地建置

```bash
# 建置生產版本
npm run build

# 預覽建置結果
npm run preview
```

### Render 部署

1. **配置檔案**：專案已包含 `build.sh` 建置腳本
2. **靜態站點設定**：
   ```
   Build Command: ./build.sh
   Publish Directory: dist
   ```
3. **環境變數**：
   ```
   VITE_BACKEND_URL=https://your-backend.onrender.com
   VITE_FRONTEND_URL=https://your-frontend.onrender.com
   ```

詳細部署指南請參考 `RENDER_部署教學.md`。

### 部署檢查

- [ ] 環境變數正確設定
- [ ] 建置無錯誤
- [ ] 路由正常運作
- [ ] API 連接正常
- [ ] 認證功能正常

## 🔧 配置說明

### Vite 配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,  // SPA 路由支援
  },
});
```

### TypeScript 配置
- 嚴格模式啟用
- 路徑別名設定
- 類型檢查完整

### 環境變數
- `VITE_BACKEND_URL` - 後端 API 地址
- `VITE_FRONTEND_URL` - 前端應用地址

## 🤝 貢獻指南

1. **Fork 專案**
2. **創建功能分支** (`git checkout -b feature/amazing-feature`)
3. **提交變更** (`git commit -m 'Add some amazing feature'`)
4. **推送分支** (`git push origin feature/amazing-feature`)
5. **開啟 Pull Request**

### 代碼規範

- 使用 TypeScript 進行開發
- 遵循 React 最佳實踐
- 組件使用函數式組件
- 合理使用 Hooks
- 保持代碼簡潔和可讀性

### 提交規範

```
feat: 新增功能
fix: 修復 bug
docs: 文檔更新
style: 代碼格式調整
refactor: 代碼重構
test: 測試相關
chore: 其他雜項
```

## 🎨 設計指南

### UI/UX 原則
- 遵循 Ant Design 設計規範
- 保持界面一致性
- 響應式設計
- 無障礙設計考量

### 色彩方案
- 主色調：Ant Design 默認藍色
- 成功：綠色 (#52c41a)
- 警告：橙色 (#faad14)
- 錯誤：紅色 (#ff4d4f)

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。

## 📞 支援

- **問題回報**：[GitHub Issues](https://github.com/your-repo/issues)
- **功能請求**：[GitHub Discussions](https://github.com/your-repo/discussions)
- **文檔**：專案 Wiki 頁面

## 🙏 致謝

- [React](https://reactjs.org/) - 前端框架
- [Ant Design](https://ant.design/) - UI 組件庫
- [Vite](https://vitejs.dev/) - 建構工具
- [TypeScript](https://www.typescriptlang.org/) - 類型系統

---

**OMS 訂單管理系統前端** - 現代化、響應式、易用的管理界面！