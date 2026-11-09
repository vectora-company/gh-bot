import { readConfig } from "./config.js";

export function getBootstrapStatus() {
  const config = readConfig();
  return {
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
  };
}
