"use client";

import { create } from "zustand";
import { Workspace } from "@/types/workspace";

interface UIState {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  toggleCommandPalette: () => void;
  
  activeWorkspace: Workspace;
  setActiveWorkspace: (workspace: Workspace) => void;
  workspaces: Workspace[];
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  commandPaletteOpen: false,
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleCommandPalette: () => set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  activeWorkspace: {
    id: "ws-1",
    name: "Design Synapse",
    slug: "design-synapse",
    theme: "purple",
  },
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  workspaces: [
    {
      id: "ws-1",
      name: "Design Synapse",
      slug: "design-synapse",
      theme: "purple",
    },
    {
      id: "ws-2",
      name: "Vercel Alpha",
      slug: "vercel-alpha",
      theme: "blue",
    },
    {
      id: "ws-3",
      name: "Personal Lab",
      slug: "personal-lab",
      theme: "amber",
    },
  ],
}));
