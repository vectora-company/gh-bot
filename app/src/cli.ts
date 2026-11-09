#!/usr/bin/env node
import { spawn } from "node:child_process";
import { access, mkdir } from "node:fs/promises";
import { constants } from "node:fs";
import { fileURLToPath } from "node:url";
import { readConfig } from "./server/config.js";

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

function start() {
  const config = readConfig();
  const entry = fileURLToPath(
    new URL("../.output/server/index.mjs", import.meta.url),
  );

  void access(entry, constants.R_OK).then(
    () => {
      const server = spawn(process.execPath, [entry], {
        stdio: "inherit",
        env: {
          ...process.env,
          NITRO_HOST: config.host,
          NITRO_PORT: String(config.port),
        },
      });

      const forwardSignal = (signal: NodeJS.Signals) => {
        if (server.exitCode === null) server.kill(signal);
      };
      process.once("SIGINT", forwardSignal);
      process.once("SIGTERM", forwardSignal);
      server.once("error", (error) => {
        console.error(
          `Falha ao iniciar o servidor TanStack Start: ${error.message}`,
        );
        process.exitCode = 1;
      });
      server.once("exit", (code, signal) => {
        process.removeListener("SIGINT", forwardSignal);
        process.removeListener("SIGTERM", forwardSignal);
        process.exitCode = code ?? (signal ? 1 : 0);
      });
    },
    () => {
      console.error(
        "Build do app ausente. Execute `pnpm build` antes de iniciar.",
      );
      process.exitCode = 1;
    },
  );
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
  start();
} else {
  console.error(`Unknown command: ${command}`);
  help();
  process.exitCode = 2;
}
