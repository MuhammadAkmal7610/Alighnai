"use client";

import Link from "next/link";
import { CMSEditor } from "./cms/CMSEditor";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CTASectionProps {
  title?: string;
  description?: string;
  isEditing?: boolean;
  onUpdate?: (field: string, value: string) => void;
}

export function CTASection({ 
  title = "Ready to understand what your AI is actually deciding?", 
  description = "No platform required. No prior governance work needed.",
  isEditing = false,
  onUpdate
}: CTASectionProps) {
  const [editingField, setEditingField] = useState<string | null>(null);

  return (
    <section className="bg-deep-blue py-20" aria-label="Call to action">
      <div className="container-main text-center">
        {isEditing && editingField === 'title' ? (
          <div className="mb-4 max-w-2xl mx-auto">
            <CMSEditor 
              variant="ghost" 
              content={title} 
              onChange={(val) => onUpdate?.('title', val)} 
            />
            <button onClick={() => setEditingField(null)} className="text-[10px] font-bold text-cyan mt-2 uppercase tracking-widest">Done</button>
          </div>
        ) : (
          <h2 
            className={cn(
              "text-2xl font-semibold text-white md:text-2xl",
              isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-2 py-1 mx-auto max-w-max"
            )}
            onDoubleClick={() => isEditing && setEditingField('title')}
            dangerouslySetInnerHTML={{ __html: title }}
          />
        )}

        {isEditing && editingField === 'description' ? (
          <div className="mt-4 max-w-6xl mx-auto">
            <CMSEditor 
              variant="ghost" 
              content={description} 
              onChange={(val) => onUpdate?.('description', val)} 
            />
            <button onClick={() => setEditingField(null)} className="text-[10px] font-bold text-cyan mt-2 uppercase tracking-widest">Done</button>
          </div>
        ) : (
          <p 
            className={cn(
              "mx-auto mt-4 max-w-6xl text-sm text-light-slate",
              isEditing && "hover:ring-1 hover:ring-cyan/30 cursor-edit transition-all rounded px-2 py-1 mx-auto max-w-max"
            )}
            onDoubleClick={() => isEditing && setEditingField('description')}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}

        <Link
          href="/contact"
          className="mt-8 inline-block rounded-btn bg-mid-blue px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan"
        >
          Start a conversation →
        </Link>
      </div>
    </section>
  );
}
