import Anthropic from "@anthropic-ai/sdk";

export type AnthropicChatTurn = {
  role: "user" | "assistant";
  content: string;
};

const DEFAULT_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_MAX_TOKENS = 768;
const DEFAULT_TEMPERATURE = 0.3;

function parseMaxTokens(): number {
  const raw = process.env.ANTHROPIC_CHAT_MAX_TOKENS;
  if (!raw) return DEFAULT_MAX_TOKENS;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_MAX_TOKENS;
  return Math.min(4096, Math.max(256, Math.floor(n)));
}

/**
 * Calls Anthropic Messages API. API key must be present in env.
 */
export async function sendAlignAIChatMessage(params: {
  systemPrompt: string;
  messages: AnthropicChatTurn[];
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY_MISSING");
  }

  const model = process.env.ANTHROPIC_CHAT_MODEL?.trim() || DEFAULT_MODEL;
  const maxTokens = parseMaxTokens();

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
