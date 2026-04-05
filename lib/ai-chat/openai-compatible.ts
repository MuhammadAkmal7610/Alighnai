import {
  resolveLlmApiKey,
  resolveLlmMaxTokens,
  resolveLlmModel,
  resolveOpenAiCompatV1Base,
} from "./resolve-config";
import { LLM_API_KEY_MISSING, type ChatTurn, type SendChatParams } from "./types";

const DEFAULT_TEMPERATURE = 0.3;

function parseExtraHeaders(): Record<string, string> | undefined {
  const raw = process.env.LLM_EXTRA_HEADERS_JSON?.trim();
  if (!raw) return undefined;
  try {
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object" || Array.isArray(o)) return undefined;
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string") out[k] = v;
    }
    return Object.keys(out).length ? out : undefined;
  } catch {
    return undefined;
  }
}

function toOpenAiMessages(
  systemPrompt: string,
  turns: ChatTurn[]
): { role: "system" | "user" | "assistant"; content: string }[] {
  return [
    { role: "system", content: systemPrompt },
    ...turns.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];
}

/** Any host that exposes OpenAI-style POST /v1/chat/completions */
export async function sendOpenAiCompatibleChatMessage(
  params: SendChatParams
): Promise<string> {
  const apiKey = resolveLlmApiKey("openai");
  if (!apiKey) {
    throw new Error(LLM_API_KEY_MISSING);
  }

  const model = resolveLlmModel("openai");
  const maxTokens = resolveLlmMaxTokens("openai");
  const v1Base = resolveOpenAiCompatV1Base();

  const headers: Record<string, string> = {
    ...parseExtraHeaders(),
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  const res = await fetch(`${v1Base}/chat/completions`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages: toOpenAiMessages(params.systemPrompt, params.messages),
      max_tokens: maxTokens,
      temperature: DEFAULT_TEMPERATURE,
    }),
  });

  const data = (await res.json()) as {
    choices?: { message?: { content?: string | null } }[];
    error?: { message?: string };
  };

  if (!res.ok) {
    const detail = data.error?.message ?? res.statusText;
    throw new Error(`LLM_UPSTREAM: ${detail}`);
  }

  const text = data.choices?.[0]?.message?.content;
  if (typeof text === "string" && text.length > 0) return text;
  return "I could not generate a response.";
}
