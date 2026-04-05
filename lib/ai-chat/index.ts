export type { AiChatProviderId, ChatTurn, LlmAdapter, SendChatParams } from "./types";
export { LLM_API_KEY_MISSING } from "./types";
export {
  isAiChatConfigured,
  isLlmConfigured,
  resolveAiChatProvider,
  resolveLlmAdapter,
  resolveLlmApiKey,
  resolveLlmModel,
  resolveOpenAiCompatV1Base,
} from "./resolve-config";
import { resolveLlmAdapter } from "./resolve-config";
import { sendOpenAiCompatibleChatMessage } from "./openai-compatible";
import type { SendChatParams } from "./types";

/**
 * Chat LLM: set LLM_NAME and LLM_API_KEY (see .env.example).
 */
export async function sendAlignAIChatMessage(
  params: SendChatParams
): Promise<string> {
  const adapter = resolveLlmAdapter();
  if (adapter === "openai") {
    return sendOpenAiCompatibleChatMessage(params);
  }
  if (adapter === "gemini") {
    const { sendGeminiChatMessage } = await import("./gemini");
    return sendGeminiChatMessage(params);
  }
  const { sendAnthropicChatMessage } = await import("./anthropic");
  return sendAnthropicChatMessage(params);
}
