"use client";

import React from "react";
import { motion } from "framer-motion";
import { Bot, ArrowRight } from "lucide-react";

interface SuggestedPromptsProps {
  workspaceId: string;
  onPromptClick: (prompt: string) => void;
}

const suggestedPrompts = [
  { text: "📝 Сделать выжимку из PRD", prompt: "Сделай подробную выжимку из моей последней заметки PRD v2" },
  { text: "🚀 Спроектировать векторный поиск", prompt: "Покажи пример настройки векторной базы данных pgvector" },
  { text: "📅 Оптимизировать встречи на Чт", prompt: "Посмотри мой календарь на Четверг и предложи план оптимизации встреч" },
  { text: "💡 Идеи для редизайна", prompt: "Дай креативные рекомендации для новой версии дизайн-системы" },
];

export function SuggestedPrompts({ workspaceId, onPromptClick }: SuggestedPromptsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col justify-center items-center text-center max-w-xl mx-auto space-y-6 pt-10"
    >
      <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
        <Bot className="h-7 w-7 text-white" />
      </div>
      
      <div>
        <h3 className="text-xl font-bold text-white font-sans">Aether AI к вашим услугам</h3>
        <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">
          Задайте любой вопрос. Я изучу все заметки, структуры баз данных, задачи и планы в Workspace <span className="text-violet-400 font-semibold uppercase">{workspaceId}</span>, чтобы предоставить точный контекстный ответ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pt-4">
        {suggestedPrompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onPromptClick(item.prompt)}
            className="p-3 rounded-lg border border-white/5 bg-zinc-900/40 hover:bg-white/5 text-left transition-all duration-200 group flex justify-between items-center"
          >
            <span className="text-xs text-zinc-300 font-medium group-hover:text-white truncate pr-2">{item.text}</span>
            <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
