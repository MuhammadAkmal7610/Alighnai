"use client";

import { useState } from "react";
import { ChatPanel } from "./ChatPanel";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-7 right-7 z-[80] flex h-[52px] w-[52px] items-center justify-center rounded-full bg-mid-blue text-white shadow-xl transition-all duration-200 ease-in-out hover:scale-[1.06] ${
          isOpen ? "rotate-90 opacity-0 pointer-events-none" : "rotate-0 opacity-100"
        }`}
        aria-label="Open chat"
        aria-expanded={isOpen}
      >
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
      </button>

      {/* Button when open (to close) - optional, but header has close button */}
    </>
  );
}
