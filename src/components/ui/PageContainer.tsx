"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageContainer({
  children,
  title,
  description,
  action,
  className
}: PageContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={cn("space-y-6 w-full h-full pb-10", className)}
    >
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center border-b border-white/5 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-zinc-400 mt-1">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="self-start sm:self-auto flex items-center gap-2">
            {action}
          </div>
        )}
      </div>

      {/* Page Content */}
      <div className="w-full">
        {children}
      </div>
    </motion.div>
  );
}
