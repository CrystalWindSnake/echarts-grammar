import { defineConfig } from "vite";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
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

  plugins: [dts()],
});
