export type ChatTurn = {
  role: "user" | "assistant";
  content: string;
};

export type SendChatParams = {
  systemPrompt: string;
  messages: ChatTurn[];
};

export const LLM_API_KEY_MISSING = "LLM_API_KEY_MISSING";

export type LlmAdapter = "openai" | "anthropic" | "gemini";

/** @deprecated Prefer LlmAdapter */
export type AiChatProviderId = LlmAdapter;
