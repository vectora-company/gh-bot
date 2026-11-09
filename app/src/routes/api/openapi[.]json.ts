import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/openapi.json")({
  server: {
    handlers: {
      GET: () =>
        Response.json({
          openapi: "3.1.0",
          info: { title: "Vectora GH Bot API", version: "0.1.0" },
          paths: {
            "/api/v1/bootstrap": { get: { summary: "Estado do setup" } },
            "/healthz": { get: { summary: "Health do processo" } },
          },
        }),
    },
  },
});
