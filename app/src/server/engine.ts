export type EngineContractVersions = {
  chat: number;
  embeddings: number;
  reranking: number;
  runs: number;
  verification: number;
  tools: number;
  tool_dispatch: number;
  tool_policy: number;
  model_tool_loop: number;
};

export type EngineRuntimeStatus = {
  status: "ready" | "unavailable";
  implementation: "rust";
  binding: "typescript-local";
  contracts?: EngineContractVersions;
  error?: string;
};

/** Read local Engine runtime readiness without exposing provider credentials. */
export async function getEngineRuntimeStatus(): Promise<EngineRuntimeStatus> {
  try {
    const engine = await import("@vectora/engine");
    return {
      status: "ready",
      implementation: "rust",
      binding: "typescript-local",
      contracts: {
        chat: engine.chatContractVersion(),
        embeddings: engine.embeddingContractVersion(),
        reranking: engine.rerankContractVersion(),
        runs: engine.runContractVersion(),
        verification: engine.evidenceGateContractVersion(),
        tools: engine.toolContractVersion(),
        tool_dispatch: engine.toolDispatchContractVersion(),
        tool_policy: engine.toolPolicyContractVersion(),
        model_tool_loop: engine.modelToolLoopContractVersion(),
      },
    };
  } catch (error) {
    return {
      status: "unavailable",
      implementation: "rust",
      binding: "typescript-local",
      error: error instanceof Error ? error.name : "EngineLoadError",
    };
  }
}
