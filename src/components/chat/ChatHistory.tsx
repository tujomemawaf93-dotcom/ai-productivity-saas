"use client";

import React from "react";
import { MessageSquare, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatHistoryItem } from "@/types/chat";

interface ChatHistoryProps {
  chatHistory: ChatHistoryItem[];
  onHistoryClick: (prompt: string) => void;
  onNewChat: () => void;
}

export function ChatHistory({ chatHistory, onHistoryClick, onNewChat }: ChatHistoryProps) {
  return (
    <GlassCard className="flex-1 p-4 flex flex-col justify-between overflow-y-auto" glowColor="rgba(139, 92, 246, 0.05)">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center">
            <MessageSquare className="h-4 w-4 mr-1.5 text-violet-400" /> Диалоги
          </span>
          <button 
            onClick={onNewChat} 
            className="p-1 rounded bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="space-y-1.5">
          {chatHistory.map((item) => (
            <button
              key={item.id}
              onClick={() => onHistoryClick(`Расскажи подробнее про ${item.title}`)}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-all"
            >
              <span className="truncate pr-2 font-medium">{item.title}</span>
              <span className="text-[10px] text-zinc-600 shrink-0">{item.time}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-white/5 pt-4 mt-6 text-xxs text-zinc-500 flex justify-between items-center">
        <span>Gemini 1.5 Pro</span>
        <span className="text-emerald-400 flex items-center">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
          Active
        </span>
      </div>
    </GlassCard>
  );
}
