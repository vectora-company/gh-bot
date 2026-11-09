import { serve } from "@hono/node-server";
import { readConfig } from "../config.js";
import { createApp } from "./app.js";

export function startServer() {
  const config = readConfig();
  const server = serve({ fetch: createApp().fetch, hostname: config.host, port: config.port });
  console.info(`Vectora GH Bot bootstrap listening at http://${config.host}:${config.port}`);
  return server;
}
