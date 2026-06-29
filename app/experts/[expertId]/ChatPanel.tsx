"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Camera,
  CheckCheck,
  Image as ImageIcon,
  Mic,
  RefreshCcw,
  Send,
} from "lucide-react";

import type { ExpertProfile } from "../experts.types";

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  outgoing: boolean;
}

const SEED_MESSAGES: ChatMessage[] = [
  { id: "m1", text: "Hello! Can I get service?", time: "7 mins", outgoing: false },
  { id: "m2", text: "Manicure, Haircut & Shaving", time: "5 mins", outgoing: false },
  { id: "m3", text: "Sure. What are you after?", time: "5 mins", outgoing: true },
  {
    id: "m4",
    text: "OK! I will add services & book you now :)",
    time: "2 mins",
    outgoing: true,
  },
];

export function ChatPanel({ expert }: { expert: ExpertProfile }) {
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [draft, setDraft] = useState("");

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: `m${Date.now()}`, text, time: "now", outgoing: true },
    ]);
    setDraft("");
  };

  return (
    <section className="flex h-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-(--brand-gold) bg-(--bg-card)">
      {/* Header */}
      <header className="flex items-center justify-between gap-3 border-b border-(--border) px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
            <Image
              src={expert.image}
              alt={expert.name}
              fill
              sizes="40px"
              className="object-cover"
            />
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-(--bg-card) bg-(--success)" />
          </span>
          <div>
            <p className="text-sm font-semibold text-(--text-primary)">
              {expert.name}
            </p>
            <p className="text-[11px] font-medium text-(--success)">Online</p>
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-(--border) px-3 py-1.5 text-[11px] font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
        >
          <RefreshCcw size={13} strokeWidth={1.8} />
          Change Expert
        </button>
      </header>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5 scrollbar-none">
        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-(--border)" />
          <span className="text-[11px] font-medium text-(--text-muted)">Today</span>
          <span className="h-px flex-1 bg-(--border)" />
        </div>

        {messages.map((message) =>
          message.outgoing ? (
            <div key={message.id} className="flex items-end justify-end gap-2">
              <div className="max-w-[75%] rounded-2xl rounded-br-sm bg-(--accent-primary) px-3.5 py-2.5 text-white">
                <p className="text-xs leading-relaxed">{message.text}</p>
                <span className="mt-1 flex items-center justify-end gap-1 text-[10px] text-white/70">
                  {message.time}
                  <CheckCheck size={13} strokeWidth={1.8} />
                </span>
              </div>
            </div>
          ) : (
            <div key={message.id} className="flex items-end gap-2">
              <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                <Image
                  src={expert.image}
                  alt={expert.name}
                  fill
                  sizes="28px"
                  className="object-cover"
                />
              </span>
              <div className="max-w-[75%] rounded-2xl rounded-bl-sm bg-(--bg-secondary) px-3.5 py-2.5">
                <p className="text-xs leading-relaxed text-(--text-primary)">
                  {message.text}
                </p>
                <span className="mt-1 block text-right text-[10px] text-(--text-muted)">
                  {message.time}
                </span>
              </div>
            </div>
          ),
        )}
      </div>

      {/* Composer */}
      <div className="flex items-center gap-2 border-t border-(--border) px-3 py-3">
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") sendMessage();
          }}
          placeholder="Type your message..."
          className="h-10 flex-1 rounded-full border border-(--border) bg-(--bg-secondary) px-4 text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) focus:outline-none"
        />
        <button
          type="button"
          onClick={sendMessage}
          className="primary-button flex h-10 items-center gap-1.5 rounded-full px-4 text-xs font-semibold text-white"
        >
          <Send size={14} strokeWidth={1.8} />
          Send
        </button>
        {[ImageIcon, Camera, Mic].map((Icon, index) => (
          <button
            key={index}
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-(--border) text-(--text-secondary) transition-colors hover:border-(--accent-primary) hover:text-(--accent-primary)"
          >
            <Icon size={16} strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </section>
  );
}
