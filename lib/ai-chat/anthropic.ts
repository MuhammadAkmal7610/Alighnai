import Anthropic from "@anthropic-ai/sdk";
import {
  resolveLlmApiKey,
  resolveLlmMaxTokens,
  resolveLlmModel,
} from "./resolve-config";
import { LLM_API_KEY_MISSING, type SendChatParams } from "./types";

const DEFAULT_TEMPERATURE = 0.3;

export async function sendAnthropicChatMessage(
  params: SendChatParams
): Promise<string> {
  const apiKey = resolveLlmApiKey("anthropic");
  if (!apiKey) {
    throw new Error(LLM_API_KEY_MISSING);
  }

  const model = resolveLlmModel("anthropic");
  const maxTokens = resolveLlmMaxTokens("anthropic");

  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature: DEFAULT_TEMPERATURE,
    system: params.systemPrompt,
    messages: params.messages,
  });

  for (const block of response.content) {
    if (block.type === "text") return block.text;
  }
  return "I could not generate a response.";
}
