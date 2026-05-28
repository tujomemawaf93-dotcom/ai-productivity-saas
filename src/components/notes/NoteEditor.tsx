"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNotesStore } from "@/store/notesStore";
import { updateNote, generateAISummary } from "@/app/actions/notes";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import debounce from "lodash.debounce";
import { GlassCard } from "@/components/ui/GlassCard";
import { Sparkles, Save, Clock, FileText } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export function NoteEditor({ workspaceSlug }: { workspaceSlug: string }) {
  const { notes, activeNoteId, updateNote: updateLocalNote } = useNotesStore();
  const activeNote = notes.find((n) => n.id === activeNoteId);
  
  const [isSaving, setIsSaving] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Оптимистичное автосохранение с дебаунсом (задержка 1 секунда после остановки печати)
  const debouncedSave = useCallback(
    debounce(async (id: string, title: string, content: string) => {
      setIsSaving(true);
      try {
        await updateNote(id, { title, content });
      } catch (e) {
        console.error("Autosave failed", e);
      } finally {
        setIsSaving(false);
      }
    }, 1000),
    []
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Начните писать здесь...",
      }),
    ],
    content: activeNote?.content || "",
    onUpdate: ({ editor }) => {
      if (!activeNoteId) return;
      const html = editor.getHTML();
      updateLocalNote(activeNoteId, { content: html });
      debouncedSave(activeNoteId, activeNote?.title || "Без названия", html);
    },
    editorProps: {
      attributes: {
        // Мы используем кастомные стили, если плагин typography не установлен
        class: "prose prose-invert max-w-none focus:outline-none min-h-[400px] text-zinc-300",
      },
    },
  });

  // Синхронизация контента редактора при смене активной заметки
  useEffect(() => {
    if (editor && activeNoteId && activeNote) {
      if (editor.getHTML() !== activeNote.content) {
        editor.commands.setContent(activeNote.content);
      }
      setSummary(null);
    }
  }, [activeNoteId, editor]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeNoteId) return;
    const newTitle = e.target.value;
    updateLocalNote(activeNoteId, { title: newTitle });
    debouncedSave(activeNoteId, newTitle, activeNote?.content || "");
  };

  const handleGenerateSummary = async () => {
    if (!activeNote || !activeNote.content.trim()) return;
    setIsGeneratingSummary(true);
    try {
      const result = await generateAISummary(activeNote.content);
      setSummary(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Пустое состояние
  if (!activeNote) {
    return (
      <GlassCard className="flex h-full items-center justify-center border-white/5 bg-zinc-950/40">
        <div className="text-center text-zinc-500">
          <FileText className="mx-auto h-12 w-12 opacity-20 mb-4" />
          <p>Выберите заметку или создайте новую</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="flex h-full gap-6">
      {/* Главный редактор */}
      <GlassCard className="flex-1 flex flex-col overflow-hidden border-white/5 bg-zinc-950/40" glowColor="rgba(139, 92, 246, 0.05)">
        <div className="border-b border-white/5 px-6 py-4 flex items-center justify-between shrink-0">
          <input
            type="text"
            value={activeNote.title}
            onChange={handleTitleChange}
            placeholder="Название заметки"
            className="bg-transparent text-2xl font-bold text-white placeholder-zinc-600 focus:outline-none flex-1"
          />
          <div className="flex items-center space-x-4 text-xs text-zinc-500 ml-4 shrink-0">
            {isSaving ? (
              <span className="flex items-center text-violet-400"><Save className="mr-1 h-3.5 w-3.5 animate-pulse" /> Сохранение...</span>
            ) : (
              <span className="flex items-center"><Clock className="mr-1 h-3.5 w-3.5" /> {format(new Date(activeNote.updatedAt), "HH:mm", { locale: ru })}</span>
            )}
            <button 
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary || !activeNote.content.trim()}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-violet-600/10 text-violet-300 rounded-lg hover:bg-violet-600/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-violet-500/20"
            >
              {isGeneratingSummary ? (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              <span>ИИ Выжимка</span>
            </button>
          </div>
        </div>
        
        {/* Область TipTap редактора */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin TipTapEditor">
          <EditorContent editor={editor} />
        </div>
      </GlassCard>

      {/* Панель ИИ-выжимки (Справа) */}
      {summary && (
        <GlassCard className="w-80 flex-shrink-0 flex flex-col overflow-hidden border-violet-500/20 bg-violet-950/10">
          <div className="border-b border-white/5 px-4 py-3 bg-violet-500/5 flex items-center space-x-2 shrink-0">
            <Sparkles className="h-4 w-4 text-violet-400" />
            <h3 className="font-medium text-sm text-violet-200">AI Summary</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap scrollbar-thin">
            {summary}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
