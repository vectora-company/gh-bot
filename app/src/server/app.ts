import { bodyLimit } from "hono/body-limit";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import { OpenAPIHono } from "@hono/zod-openapi";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import type { AppConfig } from "./config.js";
import { readConfig } from "./config.js";
import { createBootstrapRoutes } from "./routes/bootstrap.js";
import { createHealthRoutes } from "./routes/health.js";

export async function createApp(config: AppConfig = readConfig()) {
  const app = new OpenAPIHono();

  app.use("*", requestId());
  app.use("*", async (c, next) => {
    const startedAt = performance.now();
    await next();
    const log = {
      level: c.res.status >= 500 ? "error" : "info",
      event: "http_request",
      request_id: c.get("requestId"),
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration_ms: Math.round(performance.now() - startedAt),
    };
    (c.res.status >= 500 ? console.error : console.info)(JSON.stringify(log));
  });
  app.use("*", secureHeaders());
  app.use("/api/*", bodyLimit({ maxSize: 10 * 1024 * 1024 }));
  app.use(
    "/api/*",
    cors({
      origin: (origin) =>
        config.allowedOrigins.includes(origin) ? origin : undefined,
      allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
      maxAge: 600,
    }),
  );

  app.route("/", createHealthRoutes());
  app.route("/api/v1", createBootstrapRoutes(config));
  app.doc("/api/openapi.json", {
    openapi: "3.1.0",
    info: {
      title: "Vectora GH Bot API",
      version: "0.1.0",
      description: "Local control plane and GitHub integration API.",
    },
  });

  app.onError((error, c) => {
    const status = error instanceof HTTPException ? error.status : 500;
    const requestId = c.get("requestId");
    console.error(
      JSON.stringify({
        level: "error",
        event: "http_error",
        request_id: requestId,
        method: c.req.method,
        path: c.req.path,
        status,
        error_name: error.name,
      }),
    );
    return c.json(
      {
        error: {
          code:
            error instanceof HTTPException
              ? `HTTP_${status}`
              : "INTERNAL_ERROR",
          message:
            error instanceof HTTPException && status < 500
              ? error.message
              : "Erro interno.",
          requestId,
        },
      },
      status,
    );
  });

  const staticRoot = resolve(
    fileURLToPath(new URL("../../dist/web/", import.meta.url)),
  );
  const staticAdapter =
    process.versions.bun !== undefined
      ? await import("@hono/bun")
      : await import("@hono/node-server/serve-static");
  const staticFiles = staticAdapter.serveStatic({ root: staticRoot });
  app.use("*", staticFiles);
  app.notFound(async (c) => {
    if (c.req.path.startsWith("/api/")) {
      return c.json(
        {
          error: {
            code: "NOT_FOUND",
            message: "Rota da API não encontrada.",
            requestId: c.get("requestId"),
          },
        },
        404,
      );
    }
    if (c.req.method === "GET") {
      try {
        const html = await readFile(resolve(staticRoot, "index.html"), "utf8");
        return c.html(html);
      } catch {
        return c.text("Interface web não compilada.", 404);
      }
    }
    return c.text("Não encontrado.", 404);
  });

  return app;
}
