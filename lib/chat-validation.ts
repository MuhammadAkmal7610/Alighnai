import { z } from "zod";

const MAX_MESSAGE_CHARS = 4000;
const MAX_MESSAGES_IN_BODY = 24;
const MAX_TURNS_TO_MODEL = 20;

export const chatMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z
    .string()
    .min(1, "Message cannot be empty")
    .max(MAX_MESSAGE_CHARS, "Message too long"),
});

export const chatRequestSchema = z.object({
  messages: z
    .array(chatMessageSchema)
    .min(1, "At least one message required")
    .max(MAX_MESSAGES_IN_BODY, "Too many messages"),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

/** Drop leading assistant turns (e.g. client greeting) so Anthropic receives user-first thread. */
export function stripLeadingAssistantMessages(
  messages: ChatMessageInput[]
): ChatMessageInput[] {
  const out = [...messages];
  while (out.length > 0 && out[0].role === "assistant") {
    out.shift();
  }
  return out;
}

export function takeLastTurns(
  messages: ChatMessageInput[],
  max: number = MAX_TURNS_TO_MODEL
): ChatMessageInput[] {
  if (messages.length <= max) return messages;
  return messages.slice(-max);
}

const REPEATED_CHAR = /^(.)\1{200,}$/;

export function hasAbusivePattern(content: string): boolean {
  const t = content.trim();
  if (t.length < 1) return true;
  return REPEATED_CHAR.test(t);
}
