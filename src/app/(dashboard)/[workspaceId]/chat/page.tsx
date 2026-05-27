"use client";

import React, { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Bot, 
  User, 
  FileText, 
  Settings2,
  Trash2,
  Copy,
  Plus,
  ArrowRight,
  MessageSquare,
  Check,
  FileUp,
  RefreshCw,
  FolderPlus
} from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/FormElements";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
  isStreaming?: boolean;
}

export default function AIChatPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatHistory, setChatHistory] = useState([
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

      // Инициализируем пустое сообщение ИИ
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
    setAttachedFile(null); // Очищаем файл после отправки
    
    // Добавляем в историю
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

  const suggestedPrompts = [
    { text: "📝 Сделать выжимку из PRD", prompt: "Сделай подробную выжимку из моей последней заметки PRD v2" },
    { text: "🚀 Спроектировать векторный поиск", prompt: "Покажи пример настройки векторной базы данных pgvector" },
    { text: "📅 Оптимизировать встречи на Чт", prompt: "Посмотри мой календарь на Четверг и предложи план оптимизации встреч" },
    { text: "💡 Идеи для редизайна", prompt: "Дай креативные рекомендации для новой версии дизайн-системы" },
  ];

  return (
    <PageContainer
      title="Aether AI Чат"
      description="Премиальный интеллектуальный диалог с глубоким пониманием файлов вашей рабочей области"
      action={
        <Button variant="secondary" size="sm" onClick={clearHistory} className="flex items-center space-x-1">
          <Trash2 className="h-3.5 w-3.5 text-zinc-400 group-hover:text-red-400" />
          <span>Очистить чат</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-14rem)]">
        
        {/* Left Column: Chat History List */}
        <div className="hidden lg:flex flex-col space-y-4 h-full">
          <GlassCard className="flex-1 p-4 flex flex-col justify-between overflow-y-auto" glowColor="rgba(139, 92, 246, 0.05)">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-violet-400" /> Диалоги
                </span>
                <button onClick={() => setMessages([])} className="p-1 rounded bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {chatHistory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSendMessage(undefined, `Расскажи подробнее про ${item.title}`)}
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
        </div>

        {/* Center/Right Column: Main Chat Room */}
        <div className="lg:col-span-3 flex flex-col h-full rounded-xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl overflow-hidden relative">
          
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            <AnimatePresence initial={false}>
              
              {/* EMPTY STATE */}
              {messages.length === 0 && (
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
                      Задайте любой вопрос. Я изучу все заметки, структуры баз данных, задачи и планы в Workspace **{workspaceId}**, чтобы предоставить точный контекстный ответ.
                    </p>
                  </div>

                  {/* Suggested prompts grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full pt-4">
                    {suggestedPrompts.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={(e) => handleSendMessage(e, item.prompt)}
                        className="p-3 rounded-lg border border-white/5 bg-zinc-900/40 hover:bg-white/5 text-left transition-all duration-200 group flex justify-between items-center"
                      >
                        <span className="text-xs text-zinc-300 font-medium group-hover:text-white truncate pr-2">{item.text}</span>
                        <ArrowRight className="h-3 w-3 text-zinc-500 group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* MESSAGE BALLOONS */}
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"}`}>
                    
                    {/* Avatar icon */}
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg border shrink-0 ${
                      msg.role === "model" 
                        ? "bg-violet-950/40 border-violet-500/20 text-violet-400" 
                        : "bg-zinc-900 border-white/10 text-zinc-300"
                    }`}>
                      {msg.role === "model" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </div>

                    {/* Chat content bubble */}
                    <div className="space-y-1">
                      <div className={cn(
                        "rounded-xl px-4 py-3 text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-violet-600 text-white font-medium shadow-md shadow-violet-600/10"
                          : "bg-zinc-900/60 border border-white/5 text-zinc-200"
                      )}>
                        
                        {/* Rich markdown rendering */}
                        {msg.role === "model" ? (
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
                              {msg.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          msg.content
                        )}

                        {/* AI Action Panel */}
                        {msg.role === "model" && !msg.isStreaming && (
                          <div className="flex items-center space-x-2 mt-4 pt-3 border-t border-white/5">
                            <button
                              onClick={() => handleCopyText(msg.content, msg.id)}
                              className="flex items-center space-x-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              {copiedId === msg.id ? (
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
                              onClick={() => handleSendMessage(undefined, "Регенерируй прошлый ответ")}
                              className="flex items-center space-x-1 px-2 py-1 rounded bg-white/5 border border-white/5 text-[10px] text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Обновить</span>
                            </button>
                          </div>
                        )}

                      </div>
                      <p className={`text-[10px] text-zinc-500 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                        {msg.timestamp}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}

              {/* Typings / Thinking bounces */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-950/40 text-violet-400">
                      <Bot className="h-4 w-4 animate-pulse" />
                    </div>
                    <div className="flex space-x-1.5 bg-zinc-900/40 border border-white/5 rounded-xl px-4 py-3">
                      <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          {/* Drag & Drop File upload dropzone overlay */}
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
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
                <button onClick={() => setAttachedFile(null)} className="ml-2 hover:text-red-400 font-bold">×</button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={(e) => handleSendMessage(e)} className="relative flex items-center bg-zinc-900/60 border border-white/5 rounded-lg px-3 py-2">
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

        </div>
      </div>
    </PageContainer>
  );
}
