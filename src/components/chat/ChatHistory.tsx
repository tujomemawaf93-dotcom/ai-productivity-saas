"use client";

import React, { useState } from "react";
import { MessageSquare, Plus, Trash2, Edit2, Check, X, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { ChatHistoryItem } from "@/types/chat";
import { motion, AnimatePresence } from "framer-motion";

interface ChatHistoryProps {
  chatHistory: ChatHistoryItem[];
  activeSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
  onRenameChat: (sessionId: string, newTitle: string) => void;
  onDeleteChat: (sessionId: string) => void;
  isLoading?: boolean;
}

export function ChatHistory({
  chatHistory,
  activeSessionId,
  onSessionSelect,
  onNewChat,
  onRenameChat,
  onDeleteChat,
  isLoading = false,
}: ChatHistoryProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleStartEdit = (e: React.MouseEvent, item: ChatHistoryItem) => {
    e.stopPropagation();
    setEditingId(item.id);
    setEditValue(item.title);
  };

  const handleSaveEdit = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editValue.trim() && editValue.trim() !== chatHistory.find((h) => h.id === id)?.title) {
      onRenameChat(id, editValue.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить этот диалог?")) {
      onDeleteChat(id);
    }
  };

  return (
    <GlassCard
      className="flex-1 p-4 flex flex-col justify-between overflow-y-auto h-full border-white/5 bg-zinc-950/40"
      glowColor="rgba(139, 92, 246, 0.03)"
    >
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3 shrink-0">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center">
            <MessageSquare className="h-4 w-4 mr-1.5 text-violet-400" /> Диалоги
          </span>
          <button
            onClick={onNewChat}
            title="Новый диалог"
            className="p-1.5 rounded-lg bg-violet-600/10 border border-violet-500/20 text-violet-300 hover:text-white hover:bg-violet-600/30 hover:border-violet-500/40 shadow-lg shadow-violet-500/5 hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Chats History List Area */}
        <div className="flex-1 overflow-y-auto min-h-0 space-y-1.5 scrollbar-thin pr-1">
          {isLoading ? (
            // Premium pulse loader skeleton
            <div className="space-y-3 py-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex flex-col space-y-1 animate-pulse">
                  <div className="h-4 w-3/4 bg-white/5 rounded" />
                  <div className="h-2 w-1/4 bg-white/5 rounded" />
                </div>
              ))}
            </div>
          ) : chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <MessageSquare className="h-8 w-8 text-zinc-600 mb-2 stroke-[1.5]" />
              <p className="text-[10px] text-zinc-500 font-medium">История пуста</p>
              <p className="text-[9px] text-zinc-600 mt-0.5">Напишите Aether AI, чтобы начать диалог</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {chatHistory.map((item) => {
                const isActive = item.id === activeSessionId;
                const isEditing = item.id === editingId;

                return (
                  <motion.div
                    key={item.id}
                    layoutId={item.id}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => !isEditing && onSessionSelect(item.id)}
                    className={`group relative flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left cursor-pointer border select-none transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 border-violet-500/30 text-white shadow-md shadow-violet-500/5"
                        : "bg-white/0 border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                    }`}
                  >
                    {/* Active State Indicator Bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 rounded bg-violet-400" />
                    )}

                    {/* Left: Chat Session Title */}
                    <div className="flex-1 min-w-0 pr-1 z-10">
                      {isEditing ? (
                        <div className="flex items-center space-x-1 py-0.5">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit(e, item.id)}
                            onKeyDownCapture={(e) => e.key === "Escape" && setEditingId(null)}
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                            className="w-full bg-zinc-900 border border-violet-500/40 rounded px-1.5 py-0.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50"
                          />
                          <button
                            onClick={(e) => handleSaveEdit(e, item.id)}
                            className="p-0.5 text-emerald-400 hover:text-emerald-300"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="p-0.5 text-zinc-500 hover:text-zinc-300"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <span className="truncate text-xs font-semibold pr-2">
                            {item.title}
                          </span>
                          <span className="text-[9px] text-zinc-500 group-hover:text-zinc-400 mt-0.5 transition-colors">
                            {item.time}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Right: Actions on Hover */}
                    {!isEditing && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center space-x-1 shrink-0 z-20 transition-all duration-150 pl-1.5">
                        <button
                          onClick={(e) => handleStartEdit(e, item)}
                          title="Переименовать"
                          className="p-1 rounded text-zinc-500 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(e, item.id)}
                          title="Удалить диалог"
                          className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Footer Model specs */}
      <div className="border-t border-white/5 pt-3 mt-4 text-[10px] text-zinc-500 flex justify-between items-center shrink-0">
        <span className="font-semibold text-zinc-600">Gemini 1.5 Pro</span>
        <span className="text-emerald-400 flex items-center font-medium">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
          Active
        </span>
      </div>
    </GlassCard>
  );
}
