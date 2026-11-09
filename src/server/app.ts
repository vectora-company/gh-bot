import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readConfig } from "../config.js";

const webRoot = resolve(fileURLToPath(new URL("../../web/", import.meta.url)));

export function createApp() {
  const config = readConfig();
  const app = new Hono();

  app.get("/healthz", (c) => c.json({ ok: true, service: "vectora-gh-bot" }));
  app.get("/readyz", (c) =>
    c.json({
      ready: true,
      setup: "not_configured",
      integrations: {
        services: "not_connected",
        github: "not_connected",
        engine: "not_connected",
      },
    }),
  );
  app.get("/api/v1/bootstrap", (c) =>
    c.json({
      product: "Vectora GH Bot",
      servicesUrl: config.servicesUrl,
      setupRequired: true,
      capabilities: ["github", "providers", "decision_models", "storage", "behavior"],
    }),
  );

  app.use("/*", serveStatic({ root: webRoot, rewriteRequestPath: (path) => path }));
  app.get("*", serveStatic({ root: webRoot, path: "index.html" }));
  return app;
}
