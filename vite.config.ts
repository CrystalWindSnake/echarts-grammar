import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "lib"),
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "echarts-grammar",
      fileName: "echarts-grammar",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["echarts"],
      output: {
        entryFileNames: `[name].js`,
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
