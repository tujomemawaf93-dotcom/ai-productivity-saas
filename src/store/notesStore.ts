import { create } from "zustand";

export interface Folder {
  id: string;
  name: string;
  workspaceId: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  workspaceId: string;
  updatedAt: Date;
}

interface NotesState {
  folders: Folder[];
  notes: Note[];
  activeNoteId: string | null;
  searchQuery: string;
  
  setFoldersAndNotes: (folders: Folder[], notes: Note[]) => void;
  setActiveNoteId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  addFolder: (folder: Folder) => void;
  removeFolder: (id: string) => void;
  
  addNote: (note: Note) => void;
  updateNote: (id: string, data: Partial<Note>) => void;
  removeNote: (id: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  folders: [],
  notes: [],
  activeNoteId: null,
  searchQuery: "",

  setFoldersAndNotes: (folders, notes) => set({ folders, notes }),
  setActiveNoteId: (id) => set({ activeNoteId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),

  addFolder: (folder) => set((state) => ({ folders: [...state.folders, folder] })),
  removeFolder: (id) => set((state) => ({ 
    folders: state.folders.filter(f => f.id !== id),
    notes: state.notes.map(n => n.folderId === id ? { ...n, folderId: null } : n) 
  })),

  addNote: (note) => set((state) => ({ notes: [note, ...state.notes], activeNoteId: note.id })),
  updateNote: (id, data) => set((state) => ({
    notes: state.notes.map(n => n.id === id ? { ...n, ...data, updatedAt: new Date() } : n).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  })),
  removeNote: (id) => set((state) => ({
    notes: state.notes.filter(n => n.id !== id),
    activeNoteId: state.activeNoteId === id ? null : state.activeNoteId
  })),
}));
