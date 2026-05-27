"use client";

import React, { useEffect, useRef } from "react";
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
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Focus Trap & Escape key handler (A11y)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }

      if (e.key === "Tab") {
        if (!modalRef.current) return;
        
        // Селектор фокусабельных элементов
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // Автоматическая фокусировка на первом элементе модального окна
    const timer = setTimeout(() => {
      if (modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]'
        );
        if (focusableElements.length > 0) {
          (focusableElements[0] as HTMLElement).focus();
        }
      }
    }, 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
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
            ref={modalRef}
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
                aria-label="Закрыть модальное окно"
                className="absolute right-4 top-4 p-1.5 rounded-lg border border-white/5 bg-zinc-900/60 text-zinc-400 hover:text-white hover:border-white/10 transition-colors z-20"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Header */}
              <div className="border-b border-white/5 pb-4 mb-4 pr-8">
                <h2 id="modal-title" className="text-lg font-bold text-white font-sans truncate">{title}</h2>
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
