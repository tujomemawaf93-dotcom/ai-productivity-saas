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

  const handleSendMessage = async (e?: React.FormEvent, promptOverride?: string) => {
    e?.preventDefault();
    const activePrompt = promptOverride || input;
    if (!activePrompt.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: activePrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setAttachedFile(null);
    
    if (!promptOverride) {
      const historyTitle = activePrompt.length > 28 ? activePrompt.substring(0, 28) + "..." : activePrompt;
      setChatHistory((prev) => [{ id: Date.now().toString(), title: historyTitle, time: "Только что" }, ...prev]);
    }

    setIsTyping(true);

    const newAiMsgId = (Date.now() + 1).toString();
    const aiMessage: Message = {
      id: newAiMsgId,
      role: "model",
      content: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true
    };

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Не удалось получить ответ от ИИ.");
      }

      setIsTyping(false);
      setMessages((prev) => [...prev, aiMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      let accumulatedContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        accumulatedContent += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === newAiMsgId ? { ...m, content: accumulatedContent } : m
          )
        );
      }

      // Убираем флаг стриминга
      setMessages((prev) =>
        prev.map((m) =>
          m.id === newAiMsgId ? { ...m, isStreaming: false } : m
        )
      );

    } catch (err: any) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "model",
        content: "🚨 Ошибка ИИ чата Aether. Убедитесь, что в переменных окружения настроен `GEMINI_API_KEY`, или сервер доступен.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
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
