"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  FileText, 
  Folder, 
  Star, 
  Trash2, 
  Archive,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/FormElements";
import { cn } from "@/lib/utils";

interface Note {
  id: string;
  title: string;
  preview: string;
  updatedAt: string;
  tag: string;
  tagColor: string;
  starred?: boolean;
}

export default function SmartNotesPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [search, setSearch] = useState("");
  const [activeFolder, setActiveFolder] = useState("all");

  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Product Requirements Document (PRD)",
      preview: "Этот документ описывает ключевые требования к запуску MVP Aether OS, включая интеграцию с Gemini API, drag & drop виджетами и command palette...",
      updatedAt: "2 мин назад",
      tag: "Product",
      tagColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      starred: true
    },
    {
      id: "2",
      title: "Архитектура Векторного Поиска",
      preview: "Использование расширения pgvector в СУБД PostgreSQL позволяет хранить 1536-мерные эмбеддинги, генерируемые моделью text-embedding-004...",
      updatedAt: "1 час назад",
      tag: "Engineering",
      tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      starred: true
    },
    {
      id: "3",
      title: "Редизайн Дизайн-Системы (v2.0)",
      preview: "Полное переосмысление темной и светлой темы. Новые HSL переменные, пружинные веса Framer Motion для перехода между элементами...",
      updatedAt: "Вчера",
      tag: "Design",
      tagColor: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      starred: false
    },
    {
      id: "4",
      title: "Маркетинговая стратегия запуска",
      preview: "Основные инсайты для выхода на Product Hunt и Hacker News. Разработка интерактивного демо-стенда, сбор предзаказов через Waitlist...",
      updatedAt: "3 дня назад",
      tag: "Marketing",
      tagColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      starred: false
    }
  ]);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Новая заметка",
      preview: "Нажмите, чтобы начать писать...",
      updatedAt: "Только что",
      tag: "General",
      tagColor: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      starred: false
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) || 
                          note.preview.toLowerCase().includes(search.toLowerCase());
    
    if (activeFolder === "starred") return matchesSearch && note.starred;
    if (activeFolder === "product") return matchesSearch && note.tag === "Product";
    if (activeFolder === "design") return matchesSearch && note.tag === "Design";
    if (activeFolder === "engineering") return matchesSearch && note.tag === "Engineering";
    return matchesSearch;
  });

  return (
    <PageContainer
      title="Умные Заметки"
      description="Создавайте и структурируйте знания вашей команды с помощью контекстного ИИ"
      action={
        <Button onClick={handleCreateNote} className="flex items-center space-x-1.5">
          <Plus className="h-4 w-4" />
          <span>Создать заметку</span>
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Note Folders & Filters */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Поиск по заметкам..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-lg bg-zinc-950/40 border border-white/5 text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20"
            />
          </div>

          <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-2 space-y-1">
            <p className="px-3 py-1.5 text-xxs font-semibold uppercase tracking-wider text-zinc-500">Библиотека</p>
            {[
              { id: "all", name: "Все заметки", icon: FileText },
              { id: "starred", name: "Избранные", icon: Star },
            ].map((f) => {
              const Icon = f.icon;
              const isActive = activeFolder === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFolder(f.id)}
                  className={cn(
                    "flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                    isActive ? "bg-white/5 text-white font-medium" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-violet-400" : "text-zinc-500")} />
                  <span>{f.name}</span>
                </button>
              );
            })}

            <p className="px-3 py-1.5 pt-4 text-xxs font-semibold uppercase tracking-wider text-zinc-500">Категории</p>
            {[
              { id: "product", name: "Product & PRDs", icon: Folder },
              { id: "design", name: "UI & Design System", icon: Folder },
              { id: "engineering", name: "Engineering Docs", icon: Folder },
            ].map((f) => {
              const Icon = f.icon;
              const isActive = activeFolder === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFolder(f.id)}
                  className={cn(
                    "flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                    isActive ? "bg-white/5 text-white font-medium" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-violet-400" : "text-zinc-500")} />
                  <span>{f.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Notes Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <GlassCard 
                key={note.id} 
                className="flex flex-col justify-between min-h-[190px] hover:scale-[1.01] transition-transform duration-200"
                glowColor="rgba(139, 92, 246, 0.12)"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn("px-2 py-0.5 rounded text-xxs font-semibold border", note.tagColor)}>
                      {note.tag}
                    </span>
                    <button className="text-zinc-500 hover:text-zinc-300">
                      <Star className={cn("h-4 w-4", note.starred && "fill-yellow-500 text-yellow-500")} />
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 truncate font-sans">{note.title}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed mb-4">{note.preview}</p>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-auto text-xxs text-zinc-500">
                  <span>Обновлено {note.updatedAt}</span>
                  <span className="text-violet-400 flex items-center hover:underline cursor-pointer">
                    Открыть <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  </span>
                </div>
              </GlassCard>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border border-dashed border-white/10 rounded-xl bg-zinc-950/20 text-center">
              <FileText className="h-8 w-8 text-zinc-600 mb-3" />
              <p className="text-sm font-semibold text-zinc-300">Заметки не найдены</p>
              <p className="text-xs text-zinc-500 mt-1">Попробуйте изменить поисковый запрос или категорию.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
