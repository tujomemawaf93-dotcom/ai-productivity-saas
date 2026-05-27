"use client";

import { useState, useRef, useEffect } from "react";
import { Message, ChatHistoryItem } from "@/types/chat";

export function useChatStream(workspaceId: string) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    { id: "h1", title: "Векторный поиск в pgvector", time: "10 мин назад" },
    { id: "h2", title: "Архитектура PRD v2", time: "2ч назад" },
    { id: "h3", title: "Синхронизация Google Meet", time: "Вчера" },
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleCopyText = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const simulateAISpanResponse = (userPrompt: string) => {
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      
      const fullResponseText = `Я проанализировал вашу команду по воркспейсу **${workspaceId}**.

Вот подробная инструкция для реализации векторного поиска с использованием \`pgvector\`:

\`\`\`sql
-- 1. Подключаем расширение pgvector в вашей СУБД PostgreSQL
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Создаем таблицу для хранения эмбеддингов
CREATE TABLE documents (
    id bigserial PRIMARY KEY,
    content text NOT NULL,
    embedding vector(1536) -- Размерность для OpenAI text-embedding-004
);

-- 3. Выполняем поиск по косинусному сходству
SELECT id, content, 1 - (embedding <=> '[0.002, 0.003, ...]') AS similarity
FROM documents
ORDER BY similarity DESC
LIMIT 5;
\`\`\`

Также я привязал это решение к вашему календарному обзору архитектуры на Пятницу. Хотите, чтобы я автоматически сгенерировал шаблон миграции для Prisma?`;

      const newAiMsgId = Date.now().toString();
      const aiMessage: Message = {
        id: newAiMsgId,
        role: "model",
        content: "",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true
      };

      setMessages((prev) => [...prev, aiMessage]);

      let index = 0;
      const interval = setInterval(() => {
        setMessages((prev) => 
          prev.map((m) => {
            if (m.id === newAiMsgId) {
              const nextText = fullResponseText.substring(0, index + 3);
              const isFinished = nextText.length >= fullResponseText.length;
              if (isFinished) {
                clearInterval(interval);
              }
              return {
                ...m,
                content: nextText,
                isStreaming: !isFinished
              };
            }
            return m;
          })
        );
        index += 3;
      }, 10);

    }, 1200);
  };

  const handleSendMessage = (e?: React.FormEvent, promptOverride?: string) => {
    e?.preventDefault();
    const activePrompt = promptOverride || input;
    if (!activePrompt.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: activePrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setAttachedFile(null);
    
    if (!promptOverride) {
      const historyTitle = activePrompt.length > 28 ? activePrompt.substring(0, 28) + "..." : activePrompt;
      setChatHistory((prev) => [{ id: Date.now().toString(), title: historyTitle, time: "Только что" }, ...prev]);
    }

    simulateAISpanResponse(activePrompt);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setAttachedFile(e.dataTransfer.files[0].name);
    }
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return {
    input,
    setInput,
    messages,
    chatHistory,
    isTyping,
    copiedId,
    attachedFile,
    setAttachedFile,
    dragActive,
    chatEndRef,
    handleCopyText,
    handleSendMessage,
    handleDrag,
    handleDrop,
    clearHistory,
  };
}
