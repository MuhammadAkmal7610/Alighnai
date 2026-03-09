import type { Handler, HandlerEvent } from "@netlify/functions";
import { sendChatMessage } from "../../lib/anthropic";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 10;

const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = requestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  recent.push(now);
  requestLog.set(ip, recent);
  return recent.length > RATE_LIMIT_MAX;
}

const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Chat service is not configured" }),
    };
  }

  const clientIp =
    event.headers["x-forwarded-for"]?.split(",")[0]?.trim() ??
    event.headers["client-ip"] ??
    "unknown";

  if (isRateLimited(clientIp)) {
    return {
      statusCode: 429,
      body: JSON.stringify({ error: "Too many requests. Please try again shortly." }),
    };
  }

  try {
    const body = JSON.parse(event.body ?? "{}");
    const messages = body.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Messages array is required" }),
      };
    }

    const reply = await sendChatMessage(messages, apiKey);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Chat function error:", message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to process chat request" }),
    };
  }
};

export { handler };
