"use client";

import React from "react";
import { Paperclip, Send, FileUp, FileText } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ChatInputProps {
  input: string;
  setInput: (val: string) => void;
  attachedFile: string | null;
  setAttachedFile: (file: string | null) => void;
  dragActive: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onSend: (e: React.FormEvent) => void;
}

export function ChatInput({
  input,
  setInput,
  attachedFile,
  setAttachedFile,
  dragActive,
  onDrag,
  onDrop,
  onSend
}: ChatInputProps) {
  return (
    <div 
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
      className="p-4 border-t border-white/5 bg-zinc-950/70 relative"
    >
      {dragActive && (
        <div className="absolute inset-0 z-40 bg-zinc-950/95 flex flex-col items-center justify-center border-2 border-dashed border-violet-500/50 m-2 rounded-xl transition-all">
          <FileUp className="h-8 w-8 text-violet-400 animate-bounce mb-2" />
          <p className="text-xs font-semibold text-zinc-200">Перетащите файлы сюда</p>
          <p className="text-[10px] text-zinc-500 mt-1">Док-файлы, таблицы или PDF-файлы</p>
        </div>
      )}

      {/* Attached file status banner */}
      {attachedFile && (
        <div className="flex items-center space-x-2 bg-violet-600/10 border border-violet-500/20 rounded-lg px-3 py-1.5 mb-3 self-start text-xs text-violet-300 w-fit animate-pulse">
          <FileText className="h-4 w-4" />
          <span>Прикреплено: {attachedFile}</span>
          <button type="button" onClick={() => setAttachedFile(null)} className="ml-2 hover:text-red-400 font-bold">×</button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={onSend} className="relative flex items-center bg-zinc-900/60 border border-white/5 rounded-lg px-3 py-2">
        <label className="text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors mr-2 cursor-pointer">
          <Paperclip className="h-4 w-4" />
          <input 
            type="file" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setAttachedFile(e.target.files[0].name);
              }
            }} 
          />
        </label>
        <input
          type="text"
          placeholder="Спросите ИИ о вашей БД, коде или расписании..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent border-0 text-zinc-100 placeholder-zinc-500 text-sm focus:outline-none focus:ring-0 mr-4"
        />
        <Button type="submit" size="sm" className="h-8">
          <span>Отправить</span>
          <Send className="h-3 w-3 ml-1.5" />
        </Button>
      </form>
    </div>
  );
}
