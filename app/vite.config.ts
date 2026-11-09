import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import react from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const appRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root: appRoot,
  plugins: [tanstackStart(), nitro({ serverDir: "./server" }), react()],
  server: {
    host: "127.0.0.1",
    port: 3210,
    strictPort: true,
  },
});
