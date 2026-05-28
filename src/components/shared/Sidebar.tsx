"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  MessageSquare,
  FileText,
  Calendar,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ChevronDown,
  Sparkles,
  Command
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/uiStore";
import { Avatar } from "@/components/ui/Avatar";
import { useUser, useAuth } from "@clerk/nextjs";

const themeGradients: Record<string, string> = {
  purple: "from-violet-600 to-fuchsia-500",
  blue: "from-blue-600 to-cyan-500",
  amber: "from-amber-500 to-orange-600"
};

export function Sidebar() {
  const pathname = usePathname();
  const {
    sidebarCollapsed,
    toggleSidebar,
    activeWorkspace,
    workspaces,
    setActiveWorkspace
  } = useUIStore();
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { user } = useUser();
  const { signOut } = useAuth();

  const params = useParams();
  const workspaceSlug = (params?.workspaceId as string) || activeWorkspace.slug;

  const userInitials = user?.fullName
    ? user.fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "JD";

  const navItems = [
    { name: "Главная", icon: Home, path: `/${workspaceSlug}` },
    { name: "AI Чат", icon: MessageSquare, path: `/${workspaceSlug}/chat` },
    { name: "Умные Заметки", icon: FileText, path: `/${workspaceSlug}/notes` },
    { name: "Календарь", icon: Calendar, path: `/${workspaceSlug}/calendar` },
    { name: "Аналитика", icon: BarChart3, path: `/${workspaceSlug}/analytics` },
    { name: "Настройки", icon: Settings, path: `/${workspaceSlug}/settings` },
  ];

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 76 : 260 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className="relative z-20 flex h-screen flex-col border-r border-white/5 bg-zinc-950/80 backdrop-blur-xl shrink-0"
    >
      {/* Workspace Switcher Header */}
      <div className="relative border-b border-white/5 p-4">
        <button
          onClick={() => !sidebarCollapsed && setShowWorkspaceDropdown(!showWorkspaceDropdown)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg p-2 text-left transition-all duration-200",
            sidebarCollapsed ? "justify-center" : "hover:bg-white/5 active:scale-98"
          )}
        >
          <div className="flex items-center space-x-3">
            <Avatar
              variant="workspace"
              theme={activeWorkspace.theme}
              initials={activeWorkspace.name.substring(0, 2)}
            />
            {!sidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-zinc-100 truncate">{activeWorkspace.name}</p>
                <p className="text-xxs text-zinc-500 truncate">aether.os/{activeWorkspace.slug}</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition-transform duration-200", showWorkspaceDropdown && "rotate-180")} />
          )}
        </button>

        {/* Workspace Dropdown Panel */}
        <AnimatePresence>
          {showWorkspaceDropdown && !sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-4 right-4 top-18 z-50 rounded-lg border border-white/10 bg-zinc-900 p-1.5 shadow-2xl backdrop-blur-2xl"
            >
              <p className="px-2 py-1 text-xxs font-semibold uppercase tracking-wider text-zinc-500">Рабочие области</p>
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    setActiveWorkspace(ws);
                    setShowWorkspaceDropdown(false);
                  }}
                  className="flex w-full items-center space-x-2.5 rounded-md px-2 py-2 text-left text-sm text-zinc-300 hover:bg-white/5 hover:text-white transition-all"
                >
                  <Avatar
                    variant="workspace"
                    size="sm"
                    theme={ws.theme}
                    initials={ws.name.substring(0, 2)}
                  />
                  <span className="truncate">{ws.name}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1.5 px-3 py-4">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (item.path !== `/${workspaceSlug}` && pathname.startsWith(item.path + "/"));

          return (
            <Link
              key={item.name}
              href={item.path}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={cn(
                "group relative flex items-center space-x-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200",
                isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200",
                sidebarCollapsed && "justify-center"
              )}
            >
              {/* Sliding Hover Background Indicator */}
              {hoveredIndex === idx && (
                <motion.div
                  layoutId="sidebar-hover-pill"
                  className="absolute inset-0 z-0 rounded-lg bg-white/5"
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                />
              )}

              {/* Active Indicator Bar */}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bar"
                  className={cn(
                    "absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-violet-500 to-fuchsia-500",
                    sidebarCollapsed && "left-1"
                  )}
                />
              )}

              <Icon className={cn("relative z-10 h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105", isActive && "text-violet-400")} />

              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="relative z-10 truncate"
                >
                  {item.name}
                </motion.span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Area */}
      <div className="border-t border-white/5 p-4 flex flex-col space-y-3 relative">
        {/* Profile Dropdown Popover */}
        <AnimatePresence>
          {showProfileDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-16 left-4 right-4 z-50 rounded-xl border border-white/10 bg-zinc-950/95 p-3 backdrop-blur-xl shadow-2xl space-y-2"
            >
              <div className="flex items-center space-x-3 pb-2 border-b border-white/5">
                <Avatar variant="user" initials={userInitials} size="sm" />
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-zinc-200 truncate">{user?.fullName || "John Doe"}</p>
                  <p className="text-[10px] text-zinc-500 truncate">{user?.primaryEmailAddress?.emailAddress || "john@aether.os"}</p>
                </div>
              </div>

              <Link
                href={`/${workspaceSlug}/settings`}
                onClick={() => setShowProfileDropdown(false)}
                className="flex items-center space-x-2 w-full text-left px-2.5 py-1.5 text-xs text-zinc-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors"
              >
                <Settings className="h-3.5 w-3.5" />
                <span>Настройки</span>
              </Link>

              <button
                onClick={() => {
                  setShowProfileDropdown(false);
                  signOut();
                }}
                className="flex items-center space-x-2 w-full text-left px-2.5 py-1.5 text-xs text-red-400/80 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Выйти из системы</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn("flex items-center justify-between", sidebarCollapsed ? "justify-center" : "")}>
          <button
            onClick={() => !sidebarCollapsed && setShowProfileDropdown(!showProfileDropdown)}
            className="flex items-center space-x-3 text-left w-full hover:bg-white/5 p-1 rounded-lg transition-all"
          >
            <Avatar variant="user" initials={userInitials} />
            {!sidebarCollapsed && (
              <div className="overflow-hidden flex-1 pr-2">
                <p className="text-sm font-semibold text-zinc-200 truncate">{user?.fullName || "John Doe"}</p>
                <p className="text-xs text-zinc-500 truncate">{user?.primaryEmailAddress?.emailAddress || "john@aether.os"}</p>
              </div>
            )}
            {!sidebarCollapsed && (
              <ChevronDown className="h-3.5 w-3.5 text-zinc-500 hover:text-white shrink-0 transition-transform" style={{ transform: showProfileDropdown ? 'rotate(180deg)' : 'none' }} />
            )}
          </button>

          {sidebarCollapsed && (
            <button
              onClick={() => signOut()}
              className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 mt-1"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sidebar Collapse Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="flex h-8 w-full items-center justify-center rounded-lg border border-white/5 bg-zinc-900/40 text-zinc-400 hover:bg-zinc-800/60 hover:text-white transition-all active:scale-98"
        >
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
