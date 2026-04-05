"use client";

import Markdown from "react-markdown";

type Variant = "assistant" | "user";

export function ChatMessageMarkdown({
  content,
  variant,
}: {
  content: string;
  variant: Variant;
}) {
  const isUser = variant === "user";

  return (
    <div
      className={
        isUser
          ? "chat-md-user text-[15px] leading-relaxed text-navy [&_a]:font-medium [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-navy/30 [&_blockquote]:pl-2 [&_code]:rounded [&_code]:bg-navy/10 [&_code]:px-1 [&_code]:text-[0.9em] [&_h1]:mb-1 [&_h1]:mt-2 [&_h1]:text-base [&_h1]:font-bold [&_h2]:mb-1 [&_h2]:mt-2 [&_h2]:text-[15px] [&_h2]:font-bold [&_h3]:mb-1 [&_h3]:mt-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-navy/15 [&_pre]:p-2 [&_pre]:text-xs [&_strong]:font-bold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4"
          : "chat-md-assistant text-[15px] leading-relaxed text-slate-100 [&_a]:text-cyan [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-cyan/40 [&_blockquote]:pl-2 [&_blockquote]:text-slate-200 [&_code]:rounded [&_code]:bg-black/25 [&_code]:px-1 [&_code]:text-[0.9em] [&_code]:text-cyan/90 [&_h1]:mb-1 [&_h1]:mt-2 [&_h1]:text-base [&_h1]:font-bold [&_h1]:text-white [&_h2]:mb-1 [&_h2]:mt-2 [&_h2]:text-[15px] [&_h2]:font-bold [&_h2]:text-white [&_h3]:mb-1 [&_h3]:mt-1.5 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-white [&_li]:my-0.5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-2 [&_p:last-child]:mb-0 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/30 [&_pre]:p-2 [&_pre]:text-xs [&_pre]:text-slate-200 [&_strong]:font-semibold [&_strong]:text-white [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-4"
      }
    >
      <Markdown>{content}</Markdown>
    </div>
  );
}
