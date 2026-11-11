import { createServer } from "node:http";
import { once } from "node:events";
import { afterEach, describe, expect, it } from "vitest";
import { getEngineRuntimeStatus } from "./engine";
import { streamEngineChat } from "./engine-chat";

const servers: ReturnType<typeof createServer>[] = [];

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) => {
          server.close((error) => (error ? reject(error) : resolve()));
          server.closeAllConnections();
        }),
    ),
  );
});

describe("local Vectora Engine binding", () => {
  it("loads the Rust runtime and reports its contract versions", async () => {
    const status = await getEngineRuntimeStatus();

    expect(status.status).toBe("ready");
    expect(status.implementation).toBe("rust");
    expect(status.binding).toBe("typescript-local");
    expect(status.contracts).toMatchObject({
      chat: expect.any(Number),
      embeddings: expect.any(Number),
      reranking: expect.any(Number),
      runs: expect.any(Number),
      verification: expect.any(Number),
      tools: expect.any(Number),
      tool_dispatch: expect.any(Number),
      tool_policy: expect.any(Number),
      model_tool_loop: expect.any(Number),
    });
  });

  it("streams a compatible provider response through the Rust binding", async () => {
    let requestBody = "";
    let authorization: string | undefined;
    const server = createServer((request, response) => {
      authorization = request.headers.authorization;
      request.setEncoding("utf8");
      request.on("data", (chunk: string) => (requestBody += chunk));
      request.on("end", () => {
        response.writeHead(200, { "content-type": "text/event-stream" });
        response.end(
          'data: {"choices":[{"delta":{"content":"engine "}}]}\n\n' +
            'data: {"choices":[{"delta":{"content":"works"}}]}\n\n' +
            "data: [DONE]\n\n",
        );
      });
    });
    servers.push(server);
    server.listen(0, "127.0.0.1");
    await once(server, "listening");
    const address = server.address();
    if (!address || typeof address === "string") {
      throw new Error("The fixture HTTP server did not bind a TCP port.");
    }

    const chunks: string[] = [];
    for await (const chunk of streamEngineChat("say hello", {
      baseUrl: `http://127.0.0.1:${address.port}/v1`,
      model: "fixture-model",
      apiKey: "fixture-key",
    })) {
      chunks.push(chunk);
    }

    expect(chunks.join("")).toBe("engine works");
    expect(authorization).toBe("Bearer fixture-key");
    expect(JSON.parse(requestBody)).toMatchObject({
      model: "fixture-model",
      stream: true,
      messages: [{ role: "user", content: "say hello" }],
    });
  });
});
