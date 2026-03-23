"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const GREETING =
  "Hi — I can answer questions about the AlignAI framework, the AI Decision Visibility Assessment, or enterprise AI governance more broadly. What would you like to know?";

const PHASE_2_ENABLED = true;

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
        { role: "assistant", content: data.reply ?? "I'm sorry, I'm having trouble processing that right now." },
      ]);
    } catch {
      setMessages([
        ...updated,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect to the AlignAI network. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-x-3 bottom-[96px] z-[70] flex w-auto max-w-[calc(100vw-24px)] flex-col overflow-hidden rounded-xl border border-[rgba(99,188,231,0.2)] shadow-2xl sm:inset-x-auto sm:right-7 sm:w-80 sm:max-w-80"
      role="dialog"
      aria-label="Chat with AlignAI"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-deep-blue px-4 py-3 border-b border-navy">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">AlignAI</span>
          <span className="text-[10px] text-light-slate">Ask about AlignAI</span>
          <span className="rounded-full bg-mid-blue/20 border border-mid-blue/30 px-2 py-0.5 text-[10px] font-bold text-mid-blue">
            OFFICIAL
          </span>
        </div>
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
            strokeWidth="2.5"
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
        className="flex-1 overflow-y-auto bg-navy p-4 custom-scrollbar"
        style={{ height: "360px", maxHeight: "52vh" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-4 ${
              msg.role === "user" ? "text-right pl-8" : "text-left pr-8"
            }`}
          >
            <span
              className={`inline-block max-w-full rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm transition-opacity duration-300 ${
                msg.role === "user"
                  ? "bg-mid-blue text-white rounded-tr-none"
                  : "bg-deep-blue text-light-slate rounded-tl-none border border-navy shadow-inner"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
        {loading && (
          <div className="text-left animate-pulse pl-2">
            <span className="inline-block rounded-full bg-deep-blue px-3 py-1.5 text-xs text-slate-400">
              AlignAI is thinking...
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
        className="flex border-t border-navy bg-navy/95 backdrop-blur-md p-2"
      >
        <label className="sr-only" htmlFor="chat-input">
          Type a message
        </label>
        <div className="flex-1 relative flex items-center">
        <input
          id="chat-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          autoComplete="off"
          className="w-full bg-deep-blue rounded-full px-5 py-3 text-sm text-white placeholder-slate-500 outline-none border border-navy focus:border-mid-blue/50 transition-colors shadow-inner"
          disabled={loading}
        />
        <button
          type="submit"
          className="absolute right-2 p-2 text-mid-blue transition-all hover:text-cyan disabled:opacity-50 disabled:scale-95 transform active:scale-90"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
        </div>
      </form>
      <div className="bg-navy px-4 py-2 text-center text-[10px] text-slate-500 font-medium">
        Powered by <span className="text-mid-blue font-bold tracking-tight">AlignAI</span> Governance Assistant
      </div>
    </div>
  );
}
