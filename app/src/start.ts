import {
  createCsrfMiddleware,
  createMiddleware,
  createStart,
} from "@tanstack/react-start";
import { setResponseHeader } from "@tanstack/react-start/server";

const requestLogMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    const startedAt = performance.now();
    const suppliedRequestId = request.headers.get("x-request-id");
    const requestId =
      suppliedRequestId && /^[a-zA-Z0-9_-]{1,64}$/.test(suppliedRequestId)
        ? suppliedRequestId
        : crypto.randomUUID();

    try {
      const result = await next();
      const response = result.response;
      setResponseHeader("x-request-id", requestId);
      setResponseHeader("x-content-type-options", "nosniff");
      setResponseHeader("x-frame-options", "DENY");
      setResponseHeader("referrer-policy", "no-referrer");
      console.info(
        JSON.stringify({
          level: response.status >= 500 ? "error" : "info",
          event: "http_request",
          request_id: requestId,
          method: request.method,
          path: new URL(request.url).pathname,
          status: response.status,
          duration_ms: Math.round(performance.now() - startedAt),
        }),
      );
      return result;
    } catch (error) {
      console.error(
        JSON.stringify({
          level: "error",
          event: "http_error",
          request_id: requestId,
          method: request.method,
          path: new URL(request.url).pathname,
          duration_ms: Math.round(performance.now() - startedAt),
          error_name: error instanceof Error ? error.name : "UnknownError",
        }),
      );
      throw error;
    }
  },
);

const csrfMiddleware = createCsrfMiddleware({
  filter: (context) => context.handlerType === "serverFn",
});

const backgroundModeMiddleware = createMiddleware().server(
  async ({ request, next }) => {
    if (process.env.VECTORA_GH_BOT_MODE === "background") {
      const pathname = new URL(request.url).pathname;
      const isOperationalRoute =
        pathname === "/healthz" ||
        pathname === "/api/openapi.json" ||
        pathname.startsWith("/api/");
      if (!isOperationalRoute) {
        throw new Response("Dashboard disabled in background mode.", {
          status: 404,
          headers: { "content-type": "text/plain; charset=utf-8" },
        });
      }
    }
    return next();
  },
);

export const startInstance = createStart(() => ({
  requestMiddleware: [
    csrfMiddleware,
    backgroundModeMiddleware,
    requestLogMiddleware,
  ],
}));
