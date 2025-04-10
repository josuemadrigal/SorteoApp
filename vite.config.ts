import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import process from "process";

const port = parseInt(process.env.VITE_PORT || "5173");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port,
    allowedHosts: ["app.eduardespiritusanto.com"],
  },
});
