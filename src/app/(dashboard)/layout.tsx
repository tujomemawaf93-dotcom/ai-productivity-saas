"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sidebar } from "@/components/shared/Sidebar";
import { TopBar } from "@/components/shared/TopBar";
import { useUIStore } from "@/store/uiStore";
import { Menu, X } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { sidebarCollapsed } = useUIStore();

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-black bg-noise">
      {/* Background Cyber-Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

      {/* Desktop Sidebar (visible on md screens and up) */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay (Drawer Menu) */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* Dark background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-sm"
            />
            {/* Sidebar content container */}
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative flex w-[280px] h-full flex-col bg-zinc-950"
            >
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="absolute right-4 top-4 z-50 p-2 rounded-lg border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
              <Sidebar />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Workspace Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar onMenuClick={() => setMobileSidebarOpen(true)} />
        
        {/* Page Content Container */}
        <main className="flex-1 overflow-y-auto px-6 py-6 min-w-0">
          <div className="mx-auto max-w-7xl h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
