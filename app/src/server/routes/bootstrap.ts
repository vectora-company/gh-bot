import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { AppConfig } from "../config.js";

const bootstrapRoute = createRoute({
  method: "get",
  path: "/bootstrap",
  tags: ["Setup"],
  summary: "Informa os recursos do assistente de configuração",
  responses: {
    200: {
      description: "Estado inicial e capacidades configuráveis.",
      content: {
        "application/json": {
          schema: z.object({
            product: z.string(),
            servicesUrl: z.url(),
            setupRequired: z.boolean(),
            capabilities: z.array(z.string()),
          }),
        },
      },
    },
  },
});

export function createBootstrapRoutes(config: AppConfig) {
  const routes = new OpenAPIHono();
  routes.openapi(bootstrapRoute, (c) =>
    c.json(
      {
        product: "Vectora GH Bot",
        servicesUrl: config.servicesUrl,
        setupRequired: true,
        capabilities: [
          "github",
          "providers",
          "decision_models",
          "storage",
          "behavior",
        ],
      },
      200,
    ),
  );
  return routes;
}
