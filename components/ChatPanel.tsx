"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const GREETING =
  "Hi — I can answer questions about the AlignAI framework, the AI Decision Visibility Assessment, or enterprise AI governance more broadly. What would you like to know?";

/** Short label + full question sent to the API */
const SUGGESTIONS: { label: string; query: string }[] = [
  {
    label: "What is AlignAI?",
    query:
      "What is the AlignAI framework and how does it help organizations with AI governance?",
  },
  {
    label: "Decision Visibility",
    query:
      "What is the AI Decision Visibility Assessment and what does it measure?",
  },
  {
    label: "Governance pillars",
    query:
      "What are the main pillars or areas AlignAI covers for enterprise AI governance?",
  },
  {
    label: "Who is it for?",
    query:
      "Who is AlignAI designed for — what kinds of teams or industries benefit most?",
  },
  {
    label: "EU AI Act & risk",
    query:
      "How does AlignAI relate to regulations like the EU AI Act or enterprise risk management?",
  },
];

const chatLive =
  typeof process.env.NEXT_PUBLIC_CHATBOT_ENABLED === "undefined" ||
  process.env.NEXT_PUBLIC_CHATBOT_ENABLED !== "false";

type ChatApiJson = {
  reply?: string;
  error?: string;
  code?: string;
};

function errorMessageForResponse(status: number, data: ChatApiJson): string {
  if (data.code === "RATE_LIMIT" || status === 429) {
    return "You’re sending messages quickly. Please wait a moment and try again.";
  }
  if (data.code === "NO_API_KEY" || status === 503) {
    return "Chat is temporarily unavailable. Please try again later.";
  }
  if (data.code === "DISABLED" || status === 403) {
    return "This assistant is turned off right now.";
  }
  if (data.error) return data.error;
  return "Sorry, something went wrong. Please try again.";
}

export function ChatPanel({
  id,
  onClose,
}: {
  id?: string;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      if (!text || !chatLive || loading) return;

      const userMessage: Message = { role: "user", content: text };
      const updated = [...messages, userMessage];
      setMessages(updated);
      setInput("");

      setLoading(true);
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updated.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        let data: ChatApiJson = {};
        try {
          data = (await res.json()) as ChatApiJson;
        } catch {
          data = {};
        }

        if (!res.ok) {
          setMessages([
            ...updated,
            {
              role: "assistant",
              content: errorMessageForResponse(res.status, data),
            },
          ]);
          return;
        }

        setMessages([
          ...updated,
          {
            role: "assistant",
            content:
              data.reply ??
              "Sorry, I couldn’t generate a reply. Please try again.",
          },
        ]);
      } catch {
        setMessages([
          ...updated,
          {
            role: "assistant",
            content:
              "Sorry, I couldn’t connect. Check your network and try again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages, loading]
  );

  const inputDisabled = loading || !chatLive;

  return (
    <div
      id={id}
      className="fixed inset-x-3 bottom-[100px] z-[70] flex w-auto max-w-[min(calc(100vw-1.5rem),460px)] flex-col overflow-hidden rounded-2xl border border-[rgba(99,188,231,0.28)] bg-navy text-white shadow-[0_24px_64px_rgba(8,22,46,0.55)] sm:inset-x-auto sm:right-6 sm:bottom-[104px] md:right-8 md:max-w-[460px]"
      role="dialog"
      aria-label="Chat with AlignAI"
      aria-busy={loading}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-3 bg-deep-blue px-4 py-3.5 sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 gap-y-1">
            <span className="text-base font-bold tracking-tight text-white">
              AlignAI
            </span>
            <span className="rounded-full bg-cyan/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-navy">
              Beta
            </span>
          </div>
          <p className="mt-0.5 text-xs text-white/85">
            Ask about AlignAI · governance &amp; assessments
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close chat"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="min-h-[220px] flex-1 overflow-y-auto bg-gradient-to-b from-navy to-[#0a1628] px-4 py-4 sm:min-h-[280px] sm:px-5"
        style={{ maxHeight: "min(58vh, 480px)" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3.5 last:mb-1 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block max-w-[95%] rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed sm:max-w-[92%] ${
                msg.role === "user"
                  ? "bg-mid-blue text-white shadow-md shadow-mid-blue/20"
                  : "border border-white/5 bg-deep-blue/90 text-white/90 shadow-sm"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <span className="inline-flex items-center gap-2 rounded-2xl border border-white/5 bg-deep-blue/90 px-3.5 py-2.5 text-sm text-white/80">
              <span
                className="inline-flex gap-1"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan [animation-delay:-0.2s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan [animation-delay:-0.1s]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-cyan" />
              </span>
              Thinking&hellip;
            </span>
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="shrink-0 border-t border-deep-blue/70 bg-[#0a1628]/95 px-3 py-2.5 sm:px-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#8fd4f6]">
          Suggestions
        </p>
        <div className="-mx-1 flex gap-2 overflow-x-auto [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              disabled={inputDisabled}
              onClick={() => void sendMessage(s.query)}
              className="shrink-0 rounded-full border border-cyan/35 bg-deep-blue/80 px-3 py-2 text-left text-xs font-medium text-white/90 transition-colors hover:border-cyan/55 hover:bg-deep-blue hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void sendMessage(input);
        }}
        className="flex shrink-0 border-t border-deep-blue bg-navy"
      >
        <label className="sr-only" htmlFor="chat-input">
          Type a message
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            chatLive ? "Ask a question…" : "Chat is unavailable"
          }
          className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-[15px] text-white placeholder:text-white/45 outline-none sm:px-5"
          disabled={inputDisabled}
          autoComplete="off"
        />
        <button
          type="submit"
          className="shrink-0 px-4 text-mid-blue transition-colors hover:text-cyan disabled:opacity-50 sm:px-5"
          disabled={inputDisabled || !input.trim()}
          aria-label="Send message"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
      <div className="shrink-0 border-t border-deep-blue/80 bg-[#081222] px-4 py-2.5 text-center text-[11px] leading-snug text-white/55">
        Powered by AlignAI · AI-generated — verify important details
      </div>
    </div>
  );
}
