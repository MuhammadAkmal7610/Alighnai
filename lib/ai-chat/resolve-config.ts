import type { LlmAdapter } from "./types";

const DEFAULT_OPENAI_MODEL = "gpt-4o-mini";
const DEFAULT_ANTHROPIC_MODEL = "claude-sonnet-4-20250514";
const DEFAULT_GEMINI_MODEL = "gemini-2.0-flash";
const DEFAULT_MAX_TOKENS = 768;

function parseMaxTokens(raw: string | undefined): number {
  if (!raw) return DEFAULT_MAX_TOKENS;
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_MAX_TOKENS;
  return Math.min(4096, Math.max(256, Math.floor(n)));
}

function normalizeName(raw: string | undefined): string | undefined {
  return raw?.trim().toLowerCase();
}

/** When LLM_NAME is omitted, guess provider from key shape (optional convenience). */
function inferAdapterFromApiKey(key: string): LlmAdapter | undefined {
  if (key.startsWith("sk-ant-")) return "anthropic";
  if (key.startsWith("AIza")) return "gemini";
  return undefined;
}

/**
 * Primary: LLM_NAME=openai | anthropic | gemini (+ LLM_API_KEY).
 * Legacy keys (ANTHROPIC_API_KEY / OPENAI_API_KEY / GEMINI_API_KEY) still work when LLM_API_KEY is unset.
 */
export function resolveLlmAdapter(): LlmAdapter {
  const name = normalizeName(process.env.LLM_NAME);
  if (name === "openai" || name === "anthropic" || name === "gemini") {
    return name;
  }
  if (name === "claude") return "anthropic";
  if (name === "gpt") return "openai";

  const api = normalizeName(process.env.LLM_API);
  if (api === "anthropic") return "anthropic";
  if (api === "gemini") return "gemini";
  if (api === "openai" || api === "openai_compatible" || api === "compatible") {
    return "openai";
  }

  const legacy = normalizeName(process.env.AI_CHAT_PROVIDER);
  if (legacy === "openai") return "openai";

  const unifiedKey = process.env.LLM_API_KEY?.trim();
  if (unifiedKey) {
    const guessed = inferAdapterFromApiKey(unifiedKey);
    if (guessed) return guessed;
    return "openai";
  }

  if (process.env.ANTHROPIC_API_KEY?.trim()) return "anthropic";
  if (process.env.OPENAI_API_KEY?.trim()) return "openai";
  if (process.env.GEMINI_API_KEY?.trim()) return "gemini";

  return "openai";
}

export function resolveLlmApiKey(adapter: LlmAdapter): string | undefined {
  const unified = process.env.LLM_API_KEY?.trim();
  if (unified) return unified;
  if (adapter === "openai") return process.env.OPENAI_API_KEY?.trim();
  if (adapter === "gemini") return process.env.GEMINI_API_KEY?.trim();
  return process.env.ANTHROPIC_API_KEY?.trim();
}

export function isLlmConfigured(): boolean {
  return Boolean(resolveLlmApiKey(resolveLlmAdapter()));
}

/** @deprecated Use isLlmConfigured() */
export function isAiChatConfigured(forAdapter?: LlmAdapter): boolean {
  const adapter = forAdapter ?? resolveLlmAdapter();
  return Boolean(resolveLlmApiKey(adapter));
}

/** @deprecated Use resolveLlmAdapter() */
export function resolveAiChatProvider(): LlmAdapter {
  return resolveLlmAdapter();
}

export function resolveLlmModel(adapter: LlmAdapter): string {
  const unified = process.env.LLM_CHAT_MODEL?.trim();
  if (unified) return unified;
  if (adapter === "openai") {
    return process.env.OPENAI_CHAT_MODEL?.trim() || DEFAULT_OPENAI_MODEL;
  }
  if (adapter === "gemini") {
    return process.env.GEMINI_CHAT_MODEL?.trim() || DEFAULT_GEMINI_MODEL;
  }
  return process.env.ANTHROPIC_CHAT_MODEL?.trim() || DEFAULT_ANTHROPIC_MODEL;
}

export function resolveLlmMaxTokens(adapter: LlmAdapter): number {
  const unified =
    process.env.LLM_CHAT_MAX_TOKENS?.trim() ??
    process.env.AI_CHAT_MAX_TOKENS?.trim();
  const raw =
    unified ??
    (adapter === "openai"
      ? process.env.OPENAI_CHAT_MAX_TOKENS?.trim()
      : adapter === "gemini"
        ? process.env.GEMINI_CHAT_MAX_TOKENS?.trim()
        : process.env.ANTHROPIC_CHAT_MAX_TOKENS?.trim());
  return parseMaxTokens(raw);
}

/** OpenAI official or compatible base ending in /v1 */
export function resolveOpenAiCompatV1Base(): string {
  const raw =
    process.env.LLM_API_BASE_URL?.trim() ||
    process.env.OPENAI_API_BASE_URL?.trim() ||
    process.env.OPENAI_BASE_URL?.trim() ||
    "https://api.openai.com/v1";
  const base = raw.replace(/\/$/, "");
  return base.endsWith("/v1") ? base : `${base}/v1`;
}
