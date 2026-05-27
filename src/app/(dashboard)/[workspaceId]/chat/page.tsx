"use client";

import React from "react";
import { useParams } from "next/navigation";
import { Bot, Trash2 } from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { Button } from "@/components/ui/Button";

// Декомпозированные компоненты и хук
import { ChatHistory } from "@/components/chat/ChatHistory";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { ChatInput } from "@/components/chat/ChatInput";
import { useChatStream } from "@/components/chat/hooks/useChatStream";

export default function AIChatPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const {
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
    clearHistory
  } = useChatStream(workspaceId);

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
        
        {/* Left Column: Chat History Sidebar */}
        <div className="hidden lg:flex flex-col space-y-4 h-full">
          <ChatHistory 
            chatHistory={chatHistory} 
            onHistoryClick={(p) => handleSendMessage(undefined, p)} 
            onNewChat={clearHistory} 
          />
        </div>

        {/* Center/Right Column: Main Chat Room */}
        <div className="lg:col-span-3 flex flex-col h-full rounded-xl border border-white/5 bg-zinc-950/40 backdrop-blur-xl overflow-hidden relative">
          
          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
            {messages.length === 0 ? (
              <SuggestedPrompts 
                workspaceId={workspaceId} 
                onPromptClick={(p) => handleSendMessage(undefined, p)} 
              />
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  copiedId={copiedId}
                  onCopyText={handleCopyText}
                  onRegenerate={(p) => handleSendMessage(undefined, p)}
                />
              ))
            )}

            {/* Typings / Thinking bounces */}
            {isTyping && (
              <div className="flex justify-start">
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
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Interactive Chat Input & Attachment Area */}
          <ChatInput
            input={input}
            setInput={setInput}
            attachedFile={attachedFile}
            setAttachedFile={setAttachedFile}
            dragActive={dragActive}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onSend={(e) => handleSendMessage(e)}
          />

        </div>
      </div>
    </PageContainer>
  );
}
