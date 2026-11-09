#!/usr/bin/env node
import { editor, input, password, select } from "@inquirer/prompts";
import { spawn } from "node:child_process";
import {
  access,
  chmod,
  mkdir,
  open,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { constants } from "node:fs";
import { createServer } from "node:net";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { readConfig } from "./server/config.js";

const sections = [
  ["github", "Contas e integração GitHub"],
  ["providers", "Providers e credenciais por referência"],
  ["models", "Modelos por tarefa"],
  ["decisionModels", "Decision Models"],
  ["storage", "Backends de storage"],
  ["behavior", "Comportamento e políticas do bot"],
  ["engine", "Opções da Vectora Engine"],
] as const;
type ConfigSection = (typeof sections)[number][0];

const appConfigSchema = z
  .object({
    version: z.literal(1).default(1),
    github: z.record(z.string(), z.unknown()).default({}),
    providers: z.array(z.record(z.string(), z.unknown())).default([]),
    models: z.record(z.string(), z.unknown()).default({}),
    decisionModels: z.record(z.string(), z.unknown()).default({}),
    storage: z.record(z.string(), z.unknown()).default({}),
    behavior: z.record(z.string(), z.unknown()).default({}),
    engine: z.record(z.string(), z.unknown()).default({}),
  })
  .strict();
type AppConfig = z.infer<typeof appConfigSchema>;

const [command, ...args] = process.argv.slice(2);
const config = readConfig();
const cliPath = fileURLToPath(import.meta.url);
const serverEntry = fileURLToPath(
  new URL("../.output/server/index.mjs", import.meta.url),
);

function help() {
  console.log(`Vectora GH Bot — execução local por Node.js ou Bun

Uso:
  gh-bot                          abre o menu interativo
  gh-bot start [--mode dashboard|background]
  gh-bot background               inicia sem servir o dashboard React
  gh-bot stop | status
  gh-bot config [edit|show|import <arquivo>|export [arquivo]]
  gh-bot auth login|status|logout
  gh-bot doctor | --version | --help

Configuração fica em ${config.configFile}; credenciais de login ficam
separadas em ${config.authFile} e nunca entram em exportações.`);
}

function emptyConfig(): AppConfig {
  return appConfigSchema.parse({ version: 1 });
}

async function loadAppConfig(): Promise<AppConfig> {
  try {
    const parsed = appConfigSchema.parse(
      JSON.parse(await readFile(config.configFile, "utf8")),
    );
    const secret = hasEmbeddedSecret(parsed);
    if (secret) throw new Error(`Valor secreto encontrado em ${secret}.`);
    return parsed;
  } catch (error) {
    if (isMissing(error)) return emptyConfig();
    throw new Error(
      `Configuração inválida em ${config.configFile}: ${message(error)}`,
    );
  }
}

function isMissing(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "ENOENT"
  );
}

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function hasEmbeddedSecret(
  value: unknown,
  path = "config",
): string | undefined {
  if (Array.isArray(value)) {
    for (const [index, item] of value.entries()) {
      const found = hasEmbeddedSecret(item, `${path}[${index}]`);
      if (found) return found;
    }
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, nested] of Object.entries(value)) {
    const normalizedKey = key.replace(/[._-]/g, "").toLowerCase();
    const containsSecretValue = [
      "token",
      "password",
      "secret",
      "apikey",
      "privatekey",
      "secretkey",
      "credential",
    ].some((marker) => normalizedKey.endsWith(marker));
    const isSecretReference = /(env|ref|path)$/i.test(key);
    if (containsSecretValue && !isSecretReference) {
      return `${path}.${key}`;
    }
    const found = hasEmbeddedSecret(nested, `${path}.${key}`);
    if (found) return found;
  }
}

async function writeJsonSecure(path: string, value: unknown) {
  await mkdir(config.dataDir, { recursive: true, mode: 0o700 });
  if (process.platform !== "win32") await chmod(config.dataDir, 0o700);
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, {
    mode: 0o600,
  });
  await chmod(temporary, 0o600);
  await rename(temporary, path);
}

async function saveAppConfig(value: unknown) {
  const parsed = appConfigSchema.parse(value);
  const secret = hasEmbeddedSecret(parsed);
  if (secret) {
    throw new Error(
      `Não grave valores secretos em config (${secret}); use uma variável de ambiente ou referência local.`,
    );
  }
  await writeJsonSecure(config.configFile, parsed);
}

async function editConfig() {
  let current = await loadAppConfig();
  while (true) {
    const section = await select<ConfigSection | "done">({
      message: "Qual parte do GH Bot deseja configurar?",
      choices: [
        ...sections.map(([value, name]) => ({ value, name })),
        { value: "done", name: "Salvar e voltar" },
      ],
    });
    if (section === "done") break;
    const value = await editor({
      message: `Edite ${section} como JSON. Use referências/variáveis de ambiente para segredos.`,
      default: JSON.stringify(current[section], null, 2),
      postfix: ".json",
    });
    let parsed: unknown;
    try {
      parsed = JSON.parse(value);
      if (section === "providers" && !Array.isArray(parsed)) {
        throw new Error("providers deve ser uma lista JSON");
      }
      if (
        section !== "providers" &&
        (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      ) {
        throw new Error(`${section} deve ser um objeto JSON`);
      }
      current = appConfigSchema.parse({ ...current, [section]: parsed });
      await saveAppConfig(current);
      console.log(`✓ ${section} salvo em ${config.configFile}`);
    } catch (error) {
      console.error(`Configuração não salva: ${message(error)}`);
    }
  }
}

async function exportConfig(file?: string) {
  const data = `${JSON.stringify(await loadAppConfig(), null, 2)}\n`;
  if (!file || file === "-") {
    process.stdout.write(data);
    return;
  }
  await writeFile(file, data, { mode: 0o600 });
  await chmod(file, 0o600);
  console.log(
    `Configuração exportada para ${file}; autenticação não incluída.`,
  );
}

async function importConfig(file?: string) {
  if (!file) throw new Error("Informe o caminho do arquivo de configuração.");
  const imported: unknown = JSON.parse(await readFile(file, "utf8"));
  if (
    imported &&
    typeof imported === "object" &&
    ("auth" in imported || "login" in imported || "session" in imported)
  ) {
    throw new Error(
      "O arquivo contém dados de autenticação; remova-os antes de importar.",
    );
  }
  const parsed = appConfigSchema.parse(imported);
  const secret = hasEmbeddedSecret(parsed);
  if (secret) throw new Error(`O arquivo contém segredo em ${secret}.`);
  await saveAppConfig(parsed);
  console.log(
    `Configuração importada de ${file}. O login local foi preservado.`,
  );
}

async function authStatus() {
  try {
    const saved = JSON.parse(await readFile(config.authFile, "utf8")) as {
      vectoraToken?: string;
      createdAt?: string;
    };
    console.log(
      saved.vectoraToken
        ? `Vectora token salvo localmente (${saved.createdAt ?? "data desconhecida"}). A validação com Services depende do contrato de autenticação publicado.`
        : "Nenhum Vectora token configurado.",
    );
  } catch (error) {
    if (isMissing(error)) console.log("Nenhum Vectora token configurado.");
    else throw error;
  }
}

async function authLogin() {
  const token = await password({
    message: "Vectora token (o valor não será exibido):",
    mask: "*",
    validate: (value) => value.trim().length > 0 || "Informe um token.",
  });
  await writeJsonSecure(config.authFile, {
    version: 1,
    vectoraToken: token.trim(),
    servicesUrl: config.servicesUrl,
    createdAt: new Date().toISOString(),
  });
  console.log(
    `Credencial guardada separadamente em ${config.authFile} (permissão 0600). O contrato remoto de validação ainda precisa ser publicado pelo Services.`,
  );
}

async function authLogout() {
  await rm(config.authFile, { force: true });
  console.log("Credencial local removida.");
}

async function doctor() {
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
    checks.push({ name: "Data directory", ok: false, detail: "not writable" });
  }
  try {
    await access(serverEntry, constants.R_OK);
    checks.push({
      name: "TanStack Start build",
      ok: true,
      detail: serverEntry,
    });
  } catch {
    checks.push({
      name: "TanStack Start build",
      ok: false,
      detail: "run pnpm build",
    });
  }
  try {
    await loadAppConfig();
    checks.push({ name: "App config", ok: true, detail: config.configFile });
  } catch (error) {
    checks.push({ name: "App config", ok: false, detail: message(error) });
  }
  for (const check of checks)
    console.log(`${check.ok ? "✓" : "✗"} ${check.name}: ${check.detail}`);
  if (checks.some((check) => !check.ok)) process.exitCode = 1;
}

function portAvailable(host: string, port: number): Promise<boolean> {
  return new Promise((resolvePort) => {
    const server = createServer();
    server.once("error", () => resolvePort(false));
    server.listen(port, host, () => server.close(() => resolvePort(true)));
  });
}

async function openDashboard() {
  const args =
    process.platform === "win32"
      ? ["/c", "start", "", `http://${config.host}:${config.port}`]
      : process.platform === "darwin"
        ? [`http://${config.host}:${config.port}`]
        : [`http://${config.host}:${config.port}`];
  const executable =
    process.platform === "win32"
      ? "cmd"
      : process.platform === "darwin"
        ? "open"
        : "xdg-open";
  const browser = spawn(executable, args, { stdio: "ignore", detached: true });
  browser.once("error", () => {
    console.log(`Abra o dashboard em http://${config.host}:${config.port}`);
  });
  browser.unref();
}

async function runServer(mode: "dashboard" | "background") {
  try {
    await access(serverEntry, constants.R_OK);
  } catch {
    throw new Error("Build ausente. Execute `pnpm build` ou `scons build`.");
  }
  if (!(await portAvailable(config.host, config.port))) {
    throw new Error(
      `A porta ${config.port} em ${config.host} já está ocupada.`,
    );
  }
  await mkdir(config.dataDir, { recursive: true, mode: 0o700 });
  const server = spawn(process.execPath, [serverEntry], {
    stdio: "inherit",
    env: {
      ...process.env,
      NITRO_HOST: config.host,
      NITRO_PORT: String(config.port),
      VECTORA_GH_BOT_MODE: mode,
    },
  });
  if (mode === "dashboard") {
    console.log(`GH Bot ativo em http://${config.host}:${config.port}`);
    await openDashboard();
  } else {
    console.log(
      `GH Bot ativo em segundo plano em http://${config.host}:${config.port}`,
    );
  }
  await new Promise<void>((resolveServer, rejectServer) => {
    const forwardSignal = (signal: NodeJS.Signals) => {
      if (server.exitCode === null) server.kill(signal);
    };
    process.once("SIGINT", forwardSignal);
    process.once("SIGTERM", forwardSignal);
    server.once("error", rejectServer);
    server.once("exit", (code, signal) => {
      process.removeListener("SIGINT", forwardSignal);
      process.removeListener("SIGTERM", forwardSignal);
      if (code && code !== 0)
        rejectServer(new Error(`Servidor encerrou (${code}).`));
      else if (signal && signal !== "SIGTERM" && signal !== "SIGINT") {
        rejectServer(new Error(`Servidor recebeu ${signal}.`));
      } else resolveServer();
    });
  });
}

async function runBackgroundChild() {
  await writeJsonSecure(config.pidFile, {
    pid: process.pid,
    startedAt: new Date().toISOString(),
  });
  try {
    await runServer("background");
  } finally {
    const active = await readPid().catch(() => undefined);
    if (active === process.pid) await rm(config.pidFile, { force: true });
  }
}

async function readPid(): Promise<number> {
  const value = JSON.parse(await readFile(config.pidFile, "utf8")) as {
    pid?: number;
  };
  if (!Number.isInteger(value.pid) || !value.pid)
    throw new Error("PID inválido.");
  return value.pid;
}

async function isRunning(pid: number) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function backgroundStatus() {
  try {
    const pid = await readPid();
    if (await isRunning(pid))
      console.log(`GH Bot em segundo plano está ativo (PID ${pid}).`);
    else {
      await rm(config.pidFile, { force: true });
      console.log(
        "GH Bot em segundo plano está parado (arquivo PID antigo removido).",
      );
    }
  } catch (error) {
    if (isMissing(error)) console.log("GH Bot em segundo plano está parado.");
    else throw error;
  }
}

async function startBackground() {
  await mkdir(config.dataDir, { recursive: true, mode: 0o700 });
  await mkdir(dirname(config.logFile), { recursive: true });
  try {
    const pid = await readPid();
    if (await isRunning(pid)) throw new Error(`Já está rodando (PID ${pid}).`);
    await rm(config.pidFile, { force: true });
  } catch (error) {
    if (!isMissing(error)) throw error;
  }
  const log = await open(config.logFile, "a", 0o600);
  const child = spawn(process.execPath, [cliPath, "_serve-background"], {
    detached: true,
    stdio: ["ignore", log.fd, log.fd],
    env: process.env,
  });
  child.once("error", async (error) => {
    await log.close();
    console.error(`Falha ao iniciar background: ${error.message}`);
    process.exitCode = 1;
  });
  child.unref();
  await log.close();
  console.log(`GH Bot iniciando em segundo plano; logs: ${config.logFile}`);
}

async function stopBackground() {
  try {
    const pid = await readPid();
    if (!(await isRunning(pid))) {
      await rm(config.pidFile, { force: true });
      console.log("O processo já estava parado.");
      return;
    }
    process.kill(pid, "SIGTERM");
    console.log(`Sinal de encerramento enviado ao GH Bot (PID ${pid}).`);
  } catch (error) {
    if (isMissing(error))
      console.log("GH Bot em segundo plano não está ativo.");
    else throw error;
  }
}

async function interactiveMenu() {
  while (true) {
    const action = await select({
      message: "GH Bot — o que deseja fazer?",
      choices: [
        { value: "configure", name: "Configurar bot pela CLI" },
        { value: "login", name: "Entrar com Vectora Services" },
        { value: "dashboard", name: "Abrir dashboard React" },
        { value: "background", name: "Executar em segundo plano" },
        { value: "config-export", name: "Exportar configuração" },
        { value: "config-import", name: "Importar configuração" },
        { value: "exit", name: "Sair" },
      ],
    });
    if (action === "configure") await editConfig();
    else if (action === "login") await authLogin();
    else if (action === "dashboard") await runServer("dashboard");
    else if (action === "background") await startBackground();
    else if (action === "config-export") {
      const file = await input({
        message: "Arquivo de destino (vazio imprime no terminal):",
      });
      await exportConfig(file || undefined);
    } else if (action === "config-import") {
      const file = await input({
        message: "Arquivo de configuração para importar:",
      });
      await importConfig(file);
    } else return;
  }
}

try {
  if (!command || command === "menu") await interactiveMenu();
  else if (command === "--help" || command === "-h" || command === "help")
    help();
  else if (command === "--version" || command === "version")
    console.log("0.1.0");
  else if (command === "doctor") await doctor();
  else if (command === "start") {
    const modeIndex = args.indexOf("--mode");
    const mode = modeIndex >= 0 ? args[modeIndex + 1] : "dashboard";
    if (
      args.some((arg, index) => arg !== "--mode" && index !== modeIndex + 1)
    ) {
      throw new Error("Uso: gh-bot start [--mode dashboard|background]");
    }
    if (mode !== "dashboard" && mode !== "background") {
      throw new Error("--mode deve ser dashboard ou background.");
    }
    if (mode === "background") await startBackground();
    else await runServer("dashboard");
  } else if (command === "background") await startBackground();
  else if (command === "_serve-background") await runBackgroundChild();
  else if (command === "stop") await stopBackground();
  else if (command === "status") await backgroundStatus();
  else if (command === "config") {
    const action = args[0] ?? "edit";
    if (action === "edit") await editConfig();
    else if (action === "show")
      console.log(JSON.stringify(await loadAppConfig(), null, 2));
    else if (action === "export") await exportConfig(args[1]);
    else if (action === "import") await importConfig(args[1]);
    else throw new Error(`Comando config desconhecido: ${action}`);
  } else if (command === "auth") {
    if (args[0] === "login") await authLogin();
    else if (args[0] === "status") await authStatus();
    else if (args[0] === "logout") await authLogout();
    else throw new Error("Uso: gh-bot auth login|status|logout");
  } else {
    console.error(`Comando desconhecido: ${command}`);
    help();
    process.exitCode = 2;
  }
} catch (error) {
  console.error(`Erro: ${message(error)}`);
  process.exitCode = 1;
}
