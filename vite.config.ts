import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      historyApiFallback: true, // 這行非常重要，SPA 頁面打網址列會 fallback 給 index.html
    },
  };
});
