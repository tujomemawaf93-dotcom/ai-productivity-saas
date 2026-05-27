"use client";

import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Bot, User, Copy, Check, FolderPlus, RefreshCw } from "lucide-react";
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  copiedId: string | null;
  onCopyText: (text: string, msgId: string) => void;
  onRegenerate: (prompt: string) => void;
}

export function MessageBubble({
  message,
  copiedId,
  onCopyText,
  onRegenerate
}: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div className={`flex items-start space-x-3 max-w-[85%] ${isUser ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
        
        {/* Avatar icon */}
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
          !isUser 
            ? "bg-violet-950/40 border-violet-500/20 text-violet-400" 
            : "bg-zinc-900 border-white/10 text-zinc-300"
        }`}>
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Chat content bubble */}
        <div className="space-y-1">
          <div className={cn(
            "rounded-xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-violet-600 text-white font-medium shadow-md shadow-violet-600/10"
              : "bg-zinc-900/60 border border-white/5 text-zinc-200"
          )}>
            
            {/* Rich markdown rendering */}
            {!isUser ? (
              <div className="prose prose-invert max-w-none text-zinc-200 text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  components={{
                    code({ node, className, children, ...props }) {
                      return (
                        <pre className="p-3 bg-black/80 border border-white/5 rounded-lg overflow-x-auto my-2 text-xs font-mono text-violet-300">
                          <code>{children}</code>
                        </pre>
                      );
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              message.content
            )}

            {/* AI Action Panel */}
            {!isUser && !message.isStreaming && (
              <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => onCopyText(message.content, message.id)}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {copiedId === message.id ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Скопировать</span>
                    </>
                  )}
                </button>

                <button className="flex items-center space-x-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                  <FolderPlus className="h-3 w-3" />
                  <span>Создать заметку</span>
                </button>
                <button 
                  onClick={() => onRegenerate("Регенерируй прошлый ответ")}
                  className="flex items-center space-x-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Обновить</span>
                </button>
              </div>
            )}

          </div>
          <p className={`text-[10px] text-zinc-500 ${isUser ? "text-right" : "text-left"}`}>
            {message.timestamp}
          </p>
        </div>

      </div>
    </motion.div>
  );
}
