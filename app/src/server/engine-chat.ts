import type { OpenAiCompatibleSettings } from "@vectora/engine";
import { chatContractVersion, chatStream } from "@vectora/engine";

export type EngineChatConfiguration = {
  baseUrl: string;
  model: string;
  apiKey?: string;
};

/** Stream model text through the local Rust Engine binding. */
export async function* streamEngineChat(
  prompt: string,
  configuration: EngineChatConfiguration,
): AsyncGenerator<string> {
  const settings: OpenAiCompatibleSettings = {
    base_url: configuration.baseUrl,
    ...(configuration.apiKey ? { api_key: configuration.apiKey } : {}),
  };
  const request = {
    contract_version: chatContractVersion(),
    model: configuration.model,
    messages: [{ role: "user", content: prompt }],
  };

  for await (const event of chatStream(settings, request)) {
    if (event.type === "text_delta" && typeof event.text === "string") {
      yield event.text;
    }
  }
}
