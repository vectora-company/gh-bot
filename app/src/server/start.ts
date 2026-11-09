import { readConfig } from "./config.js";
import { createApp } from "./app.js";

type RuntimeServer = { stop(force?: boolean): void };
type BunRuntime = {
  serve(options: {
    fetch: (request: Request) => Response | Promise<Response>;
    hostname: string;
    port: number;
  }): RuntimeServer;
};

export async function startServer() {
  const config = readConfig();
  const app = await createApp(config);
  const bunRuntime = (globalThis as typeof globalThis & { Bun?: BunRuntime })
    .Bun;

  if (process.versions.bun !== undefined && bunRuntime) {
    const server = bunRuntime.serve({
      fetch: (request) => app.fetch(request),
      hostname: config.host,
      port: config.port,
    });
    console.info(
      JSON.stringify({
        level: "info",
        event: "server_started",
        runtime: "bun",
        host: config.host,
        port: config.port,
      }),
    );
    return { close: async () => server.stop(true) };
  }

  const { serve } = await import("@hono/node-server");
  const server = serve({
    fetch: (request) => app.fetch(request),
    hostname: config.host,
    port: config.port,
  });
  console.info(
    JSON.stringify({
      level: "info",
      event: "server_started",
      runtime: "node",
      host: config.host,
      port: config.port,
    }),
  );
  return {
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
