"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const GREETING =
  "Hi — I can answer questions about the AlignAI framework, the AI Decision Visibility Assessment, or enterprise AI governance.";

const PHASE_2_ENABLED = false;

export function ChatPanel({ onClose }: { onClose: () => void }) {
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
  }, [messages]);

  async function handleSend() {
    const text = input.trim();
    if (!text) return;

    const userMessage: Message = { role: "user", content: text };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setInput("");

    if (!PHASE_2_ENABLED) {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content:
            "Thanks for your question. The live chat feature is coming soon. Please reach out via email for now.",
        },
      ]);
      return;
    }

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
      const data = await res.json();
      setMessages([
        ...updated,
        { role: "assistant", content: data.reply ?? "Sorry, something went wrong." },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed bottom-20 right-4 z-50 flex w-80 flex-col overflow-hidden rounded-btn shadow-2xl"
      role="dialog"
      aria-label="Chat with AlignAI"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-deep-blue px-4 py-3">
        <span className="text-sm font-medium text-white">AlignAI Chat</span>
        <button
          onClick={onClose}
          className="text-light-slate hover:text-white transition-colors"
          aria-label="Close chat"
        >
          <svg
            width="18"
            height="18"
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
        className="flex-1 overflow-y-auto bg-navy p-4"
        style={{ maxHeight: 360 }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 ${
              msg.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block rounded-btn px-3 py-2 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-mid-blue text-white"
                  : "bg-deep-blue text-light-slate"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left">
            <span className="inline-block rounded-btn bg-deep-blue px-3 py-2 text-sm text-slate">
              Thinking&hellip;
            </span>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex border-t border-deep-blue bg-navy"
      >
        <label className="sr-only" htmlFor="chat-input">
          Type a message
        </label>
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-slate outline-none"
          disabled={loading}
        />
        <button
          type="submit"
          className="px-4 text-mid-blue transition-colors hover:text-cyan disabled:opacity-50"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
