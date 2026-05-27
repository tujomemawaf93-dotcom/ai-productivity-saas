"use client";

import { create } from "zustand";

interface Workspace {
  id: string;
  name: string;
  slug: string;
  logoColor: string;
}

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
    logoColor: "from-violet-600 to-fuchsia-500",
  },
  setActiveWorkspace: (workspace) => set({ activeWorkspace: workspace }),
  workspaces: [
    {
      id: "ws-1",
      name: "Design Synapse",
      slug: "design-synapse",
      logoColor: "from-violet-600 to-fuchsia-500",
    },
    {
      id: "ws-2",
      name: "Vercel Alpha",
      slug: "vercel-alpha",
      logoColor: "from-blue-600 to-cyan-500",
    },
    {
      id: "ws-3",
      name: "Personal Lab",
      slug: "personal-lab",
      logoColor: "from-amber-500 to-orange-600",
    },
  ],
}));
