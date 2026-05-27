"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GlassCard } from "./GlassCard";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  className,
  glowColor = "rgba(139, 92, 246, 0.15)"
}: ModalProps) {
  // Блокируем скролл основной страницы при открытом модальном окне
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 26 }}
            className="w-full max-w-lg z-10"
          >
            <GlassCard 
              className={cn("p-6 flex flex-col justify-between max-h-[90vh] overflow-y-auto relative", className)}
              glowColor={glowColor}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-1.5 rounded-lg border border-white/5 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-white/10 transition-colors z-20"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="border-b border-white/5 pb-4 mb-4 pr-8">
                <h2 className="text-lg font-bold text-white font-sans truncate">{title}</h2>
                {description && (
                  <p className="text-xs text-zinc-500 mt-1">{description}</p>
                )}
              </div>

              {/* Body Content */}
              <div className="text-sm text-zinc-300 flex-1 py-1">
                {children}
              </div>

              {/* Footer Actions */}
              {footer && (
                <div className="border-t border-white/5 pt-4 mt-6 flex justify-end gap-2">
                  {footer}
                </div>
              )}
            </GlassCard>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
