"use client";

import React, { useEffect } from "react";
import { useNotesStore } from "@/store/notesStore";
import { NotesSidebar } from "./NotesSidebar";
import { NoteEditor } from "./NoteEditor";

interface NotesAppProps {
  workspaceSlug: string;
  initialData: {
    folders: any[];
    notes: any[];
  };
}

export function NotesApp({ workspaceSlug, initialData }: NotesAppProps) {
  const setFoldersAndNotes = useNotesStore((state) => state.setFoldersAndNotes);

  // Инициализируем стейт начальными данными с сервера
  useEffect(() => {
    setFoldersAndNotes(initialData.folders, initialData.notes);
  }, [initialData, setFoldersAndNotes]);

  return (
    <div className="flex w-full gap-6 h-full">
      <div className="w-72 flex-shrink-0 h-full">
        <NotesSidebar workspaceSlug={workspaceSlug} />
      </div>
      <div className="flex-1 h-full min-w-0">
        <NoteEditor workspaceSlug={workspaceSlug} />
      </div>
    </div>
  );
}
