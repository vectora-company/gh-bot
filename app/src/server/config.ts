import { homedir, platform } from "node:os";
import { resolve } from "node:path";
import { z } from "zod";

const envSchema = z.object({
  VECTORA_GH_BOT_HOST: z.string().min(1).default("127.0.0.1"),
  VECTORA_GH_BOT_PORT: z.coerce.number().int().min(1).max(65535).default(3210),
  VECTORA_GH_BOT_DATA_DIR: z.string().min(1).optional(),
  VECTORA_SERVICES_URL: z.url().default("https://services.vectora.company"),
});

export function readConfig(env: NodeJS.ProcessEnv = process.env) {
  const parsed = envSchema.parse(env);
  const defaultDataDir =
    platform() === "win32"
      ? resolve(
          env.LOCALAPPDATA ?? resolve(homedir(), "AppData", "Local"),
          "Vectora GH Bot",
        )
      : platform() === "darwin"
        ? resolve(homedir(), "Library", "Application Support", "Vectora GH Bot")
        : resolve(
            env.XDG_DATA_HOME ?? resolve(homedir(), ".local", "share"),
            "vectora-gh-bot",
          );
  const dataDir =
    parsed.VECTORA_GH_BOT_DATA_DIR?.replace(/^~(?=$|[\\/])/, homedir()) ??
    defaultDataDir;
  return {
    host: parsed.VECTORA_GH_BOT_HOST,
    port: parsed.VECTORA_GH_BOT_PORT,
    dataDir,
    servicesUrl: parsed.VECTORA_SERVICES_URL.replace(/\/$/, ""),
  } as const;
}

export type AppConfig = ReturnType<typeof readConfig>;
