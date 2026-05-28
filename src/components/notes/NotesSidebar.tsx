"use client";

import React, { useState } from "react";
import { useNotesStore } from "@/store/notesStore";
import { createFolder, createNote, deleteFolder, deleteNote } from "@/app/actions/notes";
import { Folder, FileText, Search, Trash2, FolderPlus, ChevronRight, ChevronDown, Plus } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function NotesSidebar({ workspaceSlug }: { workspaceSlug: string }) {
  const { folders, notes, activeNoteId, setActiveNoteId, searchQuery, setSearchQuery, addFolder, addNote, removeFolder, removeNote } = useNotesStore();
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    try {
      const folder = await createFolder(workspaceSlug, newFolderName.trim());
      addFolder(folder);
      setIsCreatingFolder(false);
      setNewFolderName("");
      setExpandedFolders(prev => ({ ...prev, [folder.id]: true }));
    } catch (e) {
      console.error("Failed to create folder", e);
    }
  };

  const handleCreateNote = async (folderId: string | null = null) => {
    try {
      const note = await createNote(workspaceSlug, folderId);
      addNote(note);
      if (folderId) {
        setExpandedFolders(prev => ({ ...prev, [folderId]: true }));
      }
    } catch (e) {
      console.error("Failed to create note", e);
    }
  };

  const handleDeleteFolder = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить эту папку? Все заметки внутри станут без категории.")) {
      try {
        await deleteFolder(id, workspaceSlug);
        removeFolder(id);
      } catch (e) {
        console.error("Failed to delete folder", e);
      }
    }
  };

  const handleDeleteNote = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Вы уверены, что хотите удалить эту заметку?")) {
      try {
        await deleteNote(id, workspaceSlug);
        removeNote(id);
      } catch (e) {
        console.error("Failed to delete note", e);
      }
    }
  };

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <GlassCard className="flex h-full flex-col p-4 border-white/5 bg-zinc-950/40" glowColor="rgba(139, 92, 246, 0.03)">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Файлы</h2>
        <div className="flex space-x-1">
          <button onClick={() => setIsCreatingFolder(true)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <FolderPlus className="h-4 w-4" />
          </button>
          <button onClick={() => handleCreateNote(null)} className="p-1.5 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Поиск..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg bg-zinc-900/50 border border-white/5 pl-9 pr-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all"
        />
      </div>

      {isCreatingFolder && (
        <form onSubmit={handleCreateFolder} className="mb-4 flex space-x-2">
          <input
            autoFocus
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Имя папки..."
            onBlur={() => setIsCreatingFolder(false)}
            className="flex-1 rounded-md bg-zinc-900 border border-violet-500/30 px-2 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-violet-500/50"
          />
        </form>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 space-y-1 scrollbar-thin pr-1">
        {folders.map(folder => {
          const folderNotes = filteredNotes.filter(n => n.folderId === folder.id);
          const isExpanded = expandedFolders[folder.id];
          
          return (
            <div key={folder.id} className="space-y-0.5">
              <div 
                onClick={() => toggleFolder(folder.id)}
                className="group flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-left text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-colors"
              >
                <div className="flex items-center space-x-2 overflow-hidden">
                  {isExpanded ? <ChevronDown className="h-3.5 w-3.5 shrink-0" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0" />}
                  <Folder className="h-4 w-4 shrink-0 text-violet-400/70" />
                  <span className="truncate text-sm font-medium">{folder.name}</span>
                </div>
                <div className="opacity-0 group-hover:opacity-100 flex items-center shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); handleCreateNote(folder.id); }} className="p-1 hover:text-white transition-colors">
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={(e) => handleDeleteFolder(e, folder.id)} className="p-1 hover:text-red-400 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-6 space-y-0.5 mt-0.5">
                      {folderNotes.map(note => (
                        <NoteItem key={note.id} note={note} isActive={activeNoteId === note.id} onClick={() => setActiveNoteId(note.id)} onDelete={(e) => handleDeleteNote(e, note.id)} />
                      ))}
                      {folderNotes.length === 0 && <div className="text-xs text-zinc-600 pl-2 py-1 italic">Пусто</div>}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div className="pt-4 mt-2 border-t border-white/5">
          {filteredNotes.filter(n => !n.folderId).map(note => (
            <NoteItem key={note.id} note={note} isActive={activeNoteId === note.id} onClick={() => setActiveNoteId(note.id)} onDelete={(e) => handleDeleteNote(e, note.id)} />
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function NoteItem({ note, isActive, onClick, onDelete }: { note: any, isActive: boolean, onClick: () => void, onDelete: (e: any) => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-left transition-all duration-200",
        isActive ? "bg-gradient-to-r from-violet-600/15 to-fuchsia-600/10 text-white shadow-md shadow-violet-500/5 border border-violet-500/30" : "border border-transparent text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
      )}
    >
      <div className="flex items-center space-x-2 overflow-hidden relative z-10">
        {isActive && <div className="absolute -left-2 top-0 bottom-0 w-1 bg-violet-400 rounded-r" />}
        <FileText className={cn("h-4 w-4 shrink-0", isActive ? "text-fuchsia-400" : "text-zinc-500")} />
        <span className="truncate text-sm">{note.title || "Без названия"}</span>
      </div>
      <button onClick={onDelete} className={cn("p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10", isActive ? "text-zinc-300 hover:text-red-400" : "text-zinc-500 hover:text-red-400")}>
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
