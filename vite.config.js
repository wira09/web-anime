import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/sansekai-api": {
        target: "https://api.sansekai.my.id",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sansekai-api/, ""),
      },
    },
  },
});
