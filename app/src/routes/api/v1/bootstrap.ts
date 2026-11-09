import { createFileRoute } from "@tanstack/react-router";
import { getBootstrapStatus } from "../../../server/bootstrap";

export const Route = createFileRoute("/api/v1/bootstrap")({
  server: {
    handlers: {
      GET: () => Response.json(getBootstrapStatus()),
    },
  },
});
