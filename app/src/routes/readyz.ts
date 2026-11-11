import { createFileRoute } from "@tanstack/react-router";
import { getEngineRuntimeStatus } from "../server/engine";

export const Route = createFileRoute("/readyz")({
  server: {
    handlers: {
      GET: async () => {
        const engine = await getEngineRuntimeStatus();
        const ready = engine.status === "ready";
        return Response.json(
          { ready, service: "vectora-gh-bot", engine },
          { status: ready ? 200 : 503 },
        );
      },
    },
  },
});
