import { homedir } from "node:os";
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
  const dataDir = parsed.VECTORA_GH_BOT_DATA_DIR?.replace(/^~(?=$|\/)/, homedir())
    ?? resolve(homedir(), ".local/share/vectora-gh-bot");

  return {
    host: parsed.VECTORA_GH_BOT_HOST,
    port: parsed.VECTORA_GH_BOT_PORT,
    dataDir,
    servicesUrl: parsed.VECTORA_SERVICES_URL.replace(/\/$/, ""),
  } as const;
}
