"use client";

import { useState, useRef, useEffect } from "react";

interface Message {
  role: "assistant" | "user";
  content: string;
}

const GREETING =
  "Hi — I can answer questions about the AlignAI framework, the AI Decision Visibility Assessment, or enterprise AI governance more broadly. What would you like to know?";

export function ChatPanel({ onClose, isOpen }: { onClose: () => void; isOpen: boolean }) {
  const [messages] = useState<Message[]>([
    { role: "assistant", content: GREETING },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className={`fixed right-7 z-[70] flex w-80 flex-col overflow-hidden rounded-[8px] border border-[rgba(99,188,231,0.2)] bg-navy shadow-2xl transition-all duration-200 ease-in-out ${
        isOpen 
          ? "bottom-[96px] opacity-100 translate-y-0 pointer-events-auto" 
          : "bottom-[80px] opacity-0 translate-y-4 pointer-events-none"
      }`}
      role="dialog"
      aria-label="Chat with AlignAI"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-deep-blue px-4 py-3 border-b border-navy">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white tracking-tight">AlignAI</span>
          <span className="text-[10px] text-light-slate/80">Ask about AlignAI</span>
          <span className="rounded-full bg-mid-blue/20 border border-mid-blue/30 px-2 py-0.5 text-[9px] font-bold text-mid-blue uppercase tracking-wider">
            Beta
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
              className={`inline-block max-w-full rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-mid-blue text-white rounded-tr-none"
                  : "bg-deep-blue text-light-slate rounded-tl-none border border-navy/50"
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>

      {/* Input (Non-functional for Phase 1) */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex border-t border-navy bg-navy/95 backdrop-blur-md p-2"
      >
        <div className="flex-1 relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            disabled
            className="w-full bg-deep-blue/50 rounded-full px-5 py-3 text-sm text-white/50 placeholder-slate-500 outline-none border border-navy opacity-70 cursor-not-allowed"
          />
          <button
            type="button"
            className="absolute right-2 p-2 text-mid-blue/50 cursor-not-allowed"
            disabled
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

      {/* Footer */}
      <div className="bg-navy px-4 py-2.5 text-center text-[10px] text-slate-500 font-medium border-t border-navy/50">
        Powered by <span className="text-mid-blue font-bold tracking-tight">AlignAI</span>  &bull;  Phase 2 &mdash; Coming Soon
      </div>
    </div>
  );
}
