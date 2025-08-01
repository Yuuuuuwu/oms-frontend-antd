# 前端 Dockerfile - 多階段構建
# 第一階段：構建階段
FROM node:18-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json
COPY package*.json ./

# 安裝所有依賴（包括 devDependencies，建置需要）
RUN npm ci

# 複製源碼
COPY . .

# 設定建置時環境變數
ARG VITE_BACKEND_URL=http://localhost:5000
ARG VITE_FRONTEND_URL=http://localhost:3000
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_FRONTEND_URL=$VITE_FRONTEND_URL

# 構建應用程式
RUN npm run build

# 第二階段：生產階段
FROM nginx:alpine

# 複製自訂 nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 複製構建結果到 nginx 目錄
COPY --from=builder /app/dist /usr/share/nginx/html

# 暴露端口
EXPOSE 80

# 啟動 nginx
CMD ["nginx", "-g", "daemon off;"]