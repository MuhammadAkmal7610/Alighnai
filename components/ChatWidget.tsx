"use client";

import { useState } from "react";
import { ChatPanel } from "./ChatPanel";

const CHAT_PANEL_ID = "alignai-chat-panel";

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && <ChatPanel id={CHAT_PANEL_ID} onClose={() => setOpen(false)} />}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-mid-blue to-deep-blue text-white shadow-[0_10px_40px_rgba(64,123,183,0.5)]  transition-transform duration-200 ease-in-out hover:scale-[1.07] hover:ring-cyan/60 active:scale-95 sm:bottom-7 sm:right-7 sm:h-[60px] sm:w-[60px]"
        aria-label={open ? "Close chat" : "Open chat"}
        aria-expanded={open}
        aria-controls={CHAT_PANEL_ID}
      >
        {open ? (
          <svg
            width="24"
            height="24"
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
        ) : (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>
    </>
  );
}
