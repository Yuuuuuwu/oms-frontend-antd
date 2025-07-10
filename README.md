# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

## 專案結構
```
order_management_frontend/
├── public/                      # 靜態資源
│   ├── logo.png
│   ├── logo.svg
│   └── vite.svg
├── src/                         # 程式碼主目錄
│   ├── api/                     # API 封裝
│   │   ├── auth.ts
│   │   ├── customers.ts
│   │   ├── notifications.ts
│   │   ├── orders.ts
│   │   ├── payments.ts
│   │   ├── products.ts
│   │   ├── reports.ts
│   │   └── users.ts
│   ├── assets/                  # 靜態素材
│   │   └── react.svg
│   ├── components/              # 共用元件
│   │   ├── LangSwitcher.tsx
│   │   ├── NotificationDropdown.tsx
│   │   └── NotificationDropdown.css
│   ├── contexts/                # React Context
│   │   └── ThemeLangContext.tsx
│   ├── hooks/                   # 自定義 Hook
│   │   └── useNotifications.ts
│   ├── layouts/                 # 版面配置
│   │   ├── MainLayout.tsx
│   │   └── menuData.tsx
│   ├── pages/                   # 各功能頁面
│   │   ├── Auth/
│   │   │   ├── ForgotPassword.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── ResetPassword.tsx
│   │   ├── Cart/
│   │   │   ├── Cart.test.tsx
│   │   │   └── index.tsx
│   │   ├── Checkout/
│   │   │   ├── Preview.tsx
│   │   │   └── Process.tsx
│   │   ├── Customer/
│   │   │   └── index.tsx
│   │   ├── Dashboard/
│   │   │   └── index.tsx
│   │   ├── Notifications/
│   │   │   └── index.tsx
│   │   ├── Order/
│   │   │   ├── Edit.tsx
│   │   │   ├── OrderCreate.tsx
│   │   │   ├── OrderDetail.tsx
│   │   │   └── index.tsx
│   │   ├── Payment/
│   │   │   ├── PaymentResult.tsx
│   │   │   └── index.tsx
│   │   ├── PaymentNotification/
│   │   │   └── index.tsx
│   │   ├── Product/
│   │   │   ├── CategoryManager.tsx
│   │   │   └── index.tsx
│   │   ├── Profile/
│   │   │   └── index.tsx
│   │   ├── Report/
│   │   │   └── index.tsx
│   │   ├── Shop/
│   │   │   ├── ProductDetail.tsx
│   │   │   └── index.tsx
│   │   ├── User/
│   │   │   └── index.tsx
│   │   └── Landing.tsx
│   ├── types/                   # 型別定義
│   │   ├── Customer.ts
│   │   ├── Notification.ts
│   │   ├── Order.ts
│   │   ├── Payment.ts
│   │   ├── Product.ts
│   │   ├── Report.ts
│   │   └── User.ts
│   └── utils/                   # 工具函式
│       ├── auth.ts
│       ├── axiosWithAuth.ts
│       ├── env.ts
│       └── fetchWithAuth.ts
├── index.html                   # Vite 入口頁面
├── package.json                 # npm 設定與相依套件
├── vite.config.ts               # Vite 設定
├── tsconfig.json                # TypeScript 基本設定
├── tsconfig.app.json
└── tsconfig.node.json

```

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
