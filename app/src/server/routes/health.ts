import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";

const healthRoute = createRoute({
  method: "get",
  path: "/healthz",
  tags: ["System"],
  summary: "Liveness do processo",
  responses: {
    200: {
      description: "O processo está respondendo.",
      content: {
        "application/json": {
          schema: z.object({ ok: z.literal(true), service: z.string() }),
        },
      },
    },
  },
});

const readinessRoute = createRoute({
  method: "get",
  path: "/readyz",
  tags: ["System"],
  summary: "Readiness das capacidades ativadas",
  responses: {
    200: {
      description: "Estado de setup e integrações da instância.",
      content: {
        "application/json": {
          schema: z.object({
            ready: z.boolean(),
            setup: z.enum(["not_configured", "configured"]),
            integrations: z.record(z.string(), z.string()),
          }),
        },
      },
    },
    503: {
      description:
        "A instância ainda não pode atender às capacidades ativadas.",
      content: {
        "application/json": {
          schema: z.object({
            ready: z.boolean(),
            setup: z.enum(["not_configured", "configured"]),
            integrations: z.record(z.string(), z.string()),
          }),
        },
      },
    },
  },
});

export function createHealthRoutes() {
  const routes = new OpenAPIHono();
  routes.openapi(healthRoute, (c) =>
    c.json({ ok: true, service: "vectora-gh-bot" as const }, 200),
  );
  routes.openapi(readinessRoute, (c) =>
    c.json(
      {
        ready: false,
        setup: "not_configured" as const,
        integrations: {
          services: "not_connected",
          github: "not_connected",
          engine: "not_connected",
        },
      },
      503,
    ),
  );
  return routes;
}
