import {
  resolveLlmApiKey,
  resolveLlmMaxTokens,
  resolveLlmModel,
} from "./resolve-config";
import { LLM_API_KEY_MISSING, type ChatTurn, type SendChatParams } from "./types";

const DEFAULT_TEMPERATURE = 0.3;

function geminiApiRoot(): string {
  const raw = process.env.LLM_GEMINI_API_ROOT?.trim().replace(/\/$/, "");
  return raw || "https://generativelanguage.googleapis.com/v1beta";
}

function toGeminiContents(turns: ChatTurn[]): {
  role: string;
  parts: { text: string }[];
}[] {
  return turns.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function sendGeminiChatMessage(
  params: SendChatParams
): Promise<string> {
  const apiKey = resolveLlmApiKey("gemini");
  if (!apiKey) {
    throw new Error(LLM_API_KEY_MISSING);
  }

  const model = resolveLlmModel("gemini");
  const maxTokens = resolveLlmMaxTokens("gemini");
  const modelId = model.startsWith("models/") ? model.slice("models/".length) : model;

  const url = `${geminiApiRoot()}/models/${encodeURIComponent(modelId)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: params.systemPrompt }] },
      contents: toGeminiContents(params.messages),
      generationConfig: {
        maxOutputTokens: maxTokens,
        temperature: DEFAULT_TEMPERATURE,
      },
    }),
  });

  const data = (await res.json()) as {
    candidates?: {
      content?: { parts?: { text?: string }[] };
      finishReason?: string;
    }[];
    error?: { message?: string; code?: number };
  };

  if (!res.ok) {
    const detail = data.error?.message ?? res.statusText;
    throw new Error(`LLM_UPSTREAM: ${detail}`);
  }

  const parts = data.candidates?.[0]?.content?.parts;
  if (parts?.length) {
    const text = parts.map((p) => p.text ?? "").join("");
    if (text.length > 0) return text;
  }

  return "I could not generate a response.";
}
