"use client";

import React from "react";
import { Search, Sparkles, Bell, Plus, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { useUIStore } from "@/store/uiStore";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { activeWorkspace, toggleCommandPalette } = useUIStore();

  return (
    <header className="flex h-14 items-center justify-between border-b border-white/5 bg-zinc-950/40 px-6 backdrop-blur-xl z-10 shrink-0">
      {/* Breadcrumb section */}
      <div className="flex items-center space-x-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 rounded-lg border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}
        <div className="hidden items-center space-x-2 text-sm md:flex">
          <span className="text-zinc-500">Пространство</span>
          <span className="text-zinc-600">/</span>
          <span className="font-semibold text-zinc-200">{activeWorkspace.name}</span>
        </div>
      </div>

      {/* Interactive Raycast-like Search Bar Trigger */}
      <div className="flex flex-1 max-w-md mx-6">
        <button
          onClick={toggleCommandPalette}
          className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-zinc-900/40 px-3 py-1.5 text-left text-sm text-zinc-500 hover:border-white/10 hover:bg-zinc-900/60 transition-all duration-200"
        >
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-zinc-500" />
            <span className="truncate">Поиск или команда...</span>
          </div>
          <kbd className="hidden pointer-events-none select-none items-center gap-1 rounded border border-white/10 bg-zinc-950 px-1.5 font-mono text-xxs font-medium text-zinc-400 md:flex">
            <span>⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-3">
        {/* Quick AI Trigger */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-950/20 text-violet-400 hover:text-violet-300 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
          </span>
        </motion.button>

        {/* Notifications Icon */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/5 bg-zinc-900/40 text-zinc-400 hover:text-zinc-200 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-violet-500" />
        </button>

        {/* Action Quick Add Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="hidden items-center space-x-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 transition-all md:flex"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Быстрое действие</span>
        </motion.button>
      </div>
    </header>
  );
}
