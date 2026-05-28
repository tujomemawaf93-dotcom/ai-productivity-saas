"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Message, ChatHistoryItem } from "@/types/chat";

// Вспомогательная функция для красивого форматирования дат диалогов на русском языке
function formatTimeAgo(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return "Только что";
    if (diffMins < 60) return `${diffMins} мин. назад`;
    
    // Сравниваем дни
    const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    if (isToday) return `Сегодня в ${hours}:${minutes}`;
    if (isYesterday) return `Вчера в ${hours}:${minutes}`;

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return "Недавно";
  }
}

export function useChatStream(workspaceId: string) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Скролл к последнему сообщению
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Функция для загрузки списка диалогов
  const fetchSessions = useCallback(async () => {
    if (!workspaceId) return;
    try {
      const res = await fetch(`/api/chat/sessions?workspaceId=${workspaceId}`);
      if (res.ok) {
        const data = await res.json();
        const formattedHistory: ChatHistoryItem[] = data.map((session: any) => ({
          id: session.id,
          title: session.title,
          time: formatTimeAgo(session.updatedAt),
        }));
        setChatHistory(formattedHistory);
      }
    } catch (err) {
      console.error("Failed to load chat history:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [workspaceId]);

  // Загружаем список сессий при монтировании/изменении workspaceId
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Функция для загрузки сообщений конкретной сессии
  const loadSessionMessages = useCallback(async (sessionId: string) => {
    setIsTyping(true);
    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`);
      if (res.ok) {
        const session = await res.json();
        const loadedMessages: Message[] = session.messages.map((m: any) => ({
          id: m.id,
          role: m.role as "user" | "model",
          content: m.content,
          timestamp: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(loadedMessages);
      } else {
        console.error("Session not found or forbidden");
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to load session messages:", err);
    } finally {
      setIsTyping(false);
    }
  }, []);

  // Подгружаем сообщения при изменении активной сессии
  useEffect(() => {
    if (activeSessionId) {
      loadSessionMessages(activeSessionId);
    } else {
      setMessages([]);
    }
  }, [activeSessionId, loadSessionMessages]);

  const handleCopyText = (text: string, msgId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Удаление диалога (Optimistic UI)
  const deleteChat = async (sessionId: string) => {
    // Сохраняем предыдущее состояние на случай ошибки
    const previousHistory = [...chatHistory];
    
    // Оптимистично убираем из истории
    setChatHistory((prev) => prev.filter((item) => item.id !== sessionId));
    if (activeSessionId === sessionId) {
      setActiveSessionId(null);
      setMessages([]);
    }

    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete chat on server");
      }
    } catch (err) {
      console.error("Delete chat error:", err);
      // Возвращаем состояние
      setChatHistory(previousHistory);
      alert("Не удалось удалить диалог. Пожалуйста, попробуйте снова.");
    }
  };

  // Переименование диалога (Optimistic UI)
  const renameChat = async (sessionId: string, newTitle: string) => {
    if (!newTitle.trim()) return;

    // Сохраняем предыдущее состояние
    const previousHistory = [...chatHistory];

    // Оптимистично обновляем название в истории
    setChatHistory((prev) =>
      prev.map((item) => (item.id === sessionId ? { ...item, title: newTitle.trim() } : item))
    );

    try {
      const res = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to rename chat on server");
      }
    } catch (err) {
      console.error("Rename chat error:", err);
      // Возвращаем исходное название
      setChatHistory(previousHistory);
      alert("Не удалось переименовать диалог.");
    }
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
    
    // Сброс полей ввода
    setMessages(updatedMessages);
    setInput("");
    setAttachedFile(null);
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
        body: JSON.stringify({
          messages: updatedMessages,
          workspaceId,
          sessionId: activeSessionId || "new",
        }),
      });

      if (!response.ok) {
        let errMsg = "Не удалось получить ответ от ИИ.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errMsg);
      }

      // Извлекаем X-Chat-Session-Id для обновления активного сеанса
      const sessionHeader = response.headers.get("X-Chat-Session-Id");
      const isNewSession = !activeSessionId && sessionHeader;

      if (sessionHeader && activeSessionId !== sessionHeader) {
        setActiveSessionId(sessionHeader);
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

      // Обновляем список сессий чата в сайдбаре
      await fetchSessions();

    } catch (err: any) {
      setIsTyping(false);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "model",
        content: err.message || "🚨 Ошибка ИИ чата Aether. Убедитесь, что сервер базы данных доступен.",
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
    setActiveSessionId(null);
    setMessages([]);
  };

  return {
    input,
    setInput,
    messages,
    chatHistory,
    activeSessionId,
    setActiveSessionId,
    isLoadingHistory,
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
    deleteChat,
    renameChat,
  };
}
