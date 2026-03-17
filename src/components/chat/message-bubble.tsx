"use client";

import * as React from "react";

import { cn } from "@/lib/cn";

export type ChatRole = "user" | "assistant" | "system";

export type MessageBubbleProps = {
  role: ChatRole;
  content: React.ReactNode;
  timestamp?: string;
  className?: string;
};

export function MessageBubble({
  role,
  content,
  timestamp,
  className,
}: MessageBubbleProps) {
  const isUser = role === "user";
  return (
    <div
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start", className)}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6",
          isUser
            ? "bg-zinc-900 text-white"
            : "bg-zinc-100 text-zinc-900",
        )}
      >
        <div className="whitespace-pre-wrap">{content}</div>
        {timestamp ? (
          <div
            className={cn(
              "mt-2 text-xs",
              isUser ? "text-white/70" : "text-zinc-600",
            )}
          >
            {timestamp}
          </div>
        ) : null}
      </div>
    </div>
  );
}

