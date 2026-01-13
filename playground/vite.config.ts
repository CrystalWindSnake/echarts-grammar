import { defineConfig } from "vite";

export default defineConfig({
  server: {
    port: 5173,
  },
  optimizeDeps: {
    exclude: ["echarts-grammar"], // 你的库名
  },
});
