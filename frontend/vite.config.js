import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://manu12901201-ai-task-knowledge-backend.hf.space",
        changeOrigin: true,
      },
    },
  },
});
