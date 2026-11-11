import { readConfig } from "./config.js";
import { getEngineRuntimeStatus } from "./engine.js";

export async function getBootstrapStatus() {
  const config = readConfig();
  return {
    product: "Vectora GH Bot",
    servicesUrl: config.servicesUrl,
    engine: await getEngineRuntimeStatus(),
    setupRequired: true,
    capabilities: [
      "github",
      "providers",
      "decision_models",
      "storage",
      "behavior",
    ],
  };
}
