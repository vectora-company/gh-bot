#!/usr/bin/env node
import { access, mkdir } from "node:fs/promises";
import { constants } from "node:fs";
import { readConfig } from "./config.js";
import { startServer } from "./server/start.js";

const [command = "start", ...args] = process.argv.slice(2);

function help() {
  console.log(
    `Vectora GH Bot\n\nUsage:\n  vectora-gh-bot [start]\n  vectora-gh-bot doctor\n  vectora-gh-bot --version\n  vectora-gh-bot --help\n\nThe setup UI and CLI configuration commands are being bootstrapped.`,
  );
}

async function doctor() {
  const config = readConfig();
  const checks: Array<{ name: string; ok: boolean; detail: string }> = [
    {
      name: process.versions.bun ? "Bun" : "Node.js",
      ok: process.versions.bun
        ? true
        : Number(process.versions.node.split(".")[0]) >= 22,
      detail: process.versions.bun ?? process.versions.node,
    },
  ];

  try {
    await mkdir(config.dataDir, { recursive: true, mode: 0o700 });
    await access(config.dataDir, constants.R_OK | constants.W_OK);
    checks.push({ name: "Data directory", ok: true, detail: config.dataDir });
  } catch {
    checks.push({
      name: "Data directory",
      ok: false,
      detail: `${config.dataDir} is not writable`,
    });
  }

  checks.push({
    name: "Services URL configured",
    ok: true,
    detail: config.servicesUrl,
  });
  for (const check of checks)
    console.log(`${check.ok ? "✓" : "✗"} ${check.name}: ${check.detail}`);
  if (checks.some((check) => !check.ok)) process.exitCode = 1;
}

if (args.length > 0) {
  console.error(`Unexpected arguments: ${args.join(" ")}`);
  process.exitCode = 2;
} else if (command === "--help" || command === "-h" || command === "help") {
  help();
} else if (command === "--version" || command === "version") {
  console.log("0.1.0");
} else if (command === "doctor") {
  await doctor();
} else if (command === "start") {
  const server = await startServer();
  let shuttingDown = false;
  const shutdown = async (signal: NodeJS.Signals) => {
    if (shuttingDown) return;
    shuttingDown = true;
    console.info(
      JSON.stringify({ level: "info", event: "shutdown_started", signal }),
    );
    await server.close();
    console.info(JSON.stringify({ level: "info", event: "shutdown_complete" }));
  };
  process.once("SIGINT", (signal) => void shutdown(signal));
  process.once("SIGTERM", (signal) => void shutdown(signal));
} else {
  console.error(`Unknown command: ${command}`);
  help();
  process.exitCode = 2;
}
