import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/my_portfolio_frontend/',
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:4001"
    }
  }
});
