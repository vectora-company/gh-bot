import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: appRoot,
  plugins: [react()],
  build: { outDir: resolve(appRoot, "dist/web"), emptyOutDir: true },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:3210",
      "/healthz": "http://127.0.0.1:3210",
    },
  },
});
