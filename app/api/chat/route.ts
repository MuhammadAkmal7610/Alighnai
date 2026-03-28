import { NextResponse } from "next/server";
import { buildFullSystemPrompt } from "@/lib/alignai-chat-system";
import { sendAlignAIChatMessage } from "@/lib/anthropic";
import { allowChatRequest, getClientIp } from "@/lib/chat-rate-limit";
import { getCachedSiteContextForChat } from "@/lib/chat-site-context";
import {
  chatRequestSchema,
  hasAbusivePattern,
  stripLeadingAssistantMessages,
  takeLastTurns,
} from "@/lib/chat-validation";

const CHATBOT_DISABLED =
  process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "false" ||
  process.env.CHATBOT_API_ENABLED === "false";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (CHATBOT_DISABLED) {
    return NextResponse.json(
      { error: "Chat is disabled.", code: "DISABLED" },
      { status: 403 }
    );
  }

  const ip = getClientIp(request);
  if (!allowChatRequest(ip)) {
    return NextResponse.json(
      {
        error: "Too many requests. Please try again in a few minutes.",
        code: "RATE_LIMIT",
      },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      {
        error: "Chat is temporarily unavailable.",
        code: "NO_API_KEY",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body.", code: "BAD_JSON" },
      { status: 400 }
    );
  }

  const parsed = chatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid message payload.", code: "VALIDATION" },
      { status: 400 }
    );
  }

  for (const m of parsed.data.messages) {
    if (hasAbusivePattern(m.content)) {
      return NextResponse.json(
        { error: "Message could not be sent.", code: "INVALID_MESSAGE" },
        { status: 400 }
      );
    }
  }

  const thread = takeLastTurns(stripLeadingAssistantMessages(parsed.data.messages));
  if (thread.length === 0) {
    return NextResponse.json(
      { error: "No user message to respond to.", code: "NO_USER_MESSAGE" },
      { status: 400 }
    );
  }

  const last = thread[thread.length - 1];
  if (last.role !== "user") {
    return NextResponse.json(
      { error: "Last message must be from the user.", code: "BAD_ORDER" },
      { status: 400 }
    );
  }

  let siteAppendix: string;
  try {
    siteAppendix = await getCachedSiteContextForChat();
  } catch (e) {
    console.error("[api/chat] site context load failed:", e);
    siteAppendix = "";
  }

  const systemPrompt = buildFullSystemPrompt(siteAppendix);

  try {
    const reply = await sendAlignAIChatMessage({
      systemPrompt,
      messages: thread,
    });
    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg === "ANTHROPIC_API_KEY_MISSING") {
      return NextResponse.json(
        { error: "Chat is temporarily unavailable.", code: "NO_API_KEY" },
        { status: 503 }
      );
    }
    console.error("[api/chat] Anthropic error:", msg.slice(0, 500));
    return NextResponse.json(
      {
        error: "The assistant could not complete your request. Please try again.",
        code: "UPSTREAM",
      },
      { status: 502 }
    );
  }
}
