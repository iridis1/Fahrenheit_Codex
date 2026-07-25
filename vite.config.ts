import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  build: {
    outDir: "dist-client"
  },
  server: {
    port: 5173,
    proxy: {
      "/convert": "http://127.0.0.1:3000"
    }
  }
});
