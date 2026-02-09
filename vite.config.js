import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-to-print": fileURLToPath(
        new URL("./src/utils/react-to-print.js", import.meta.url)
      )
    }
  },
  server: {
    port: 5173,
    host: true
  }
});
