"use client";

import React, { useRef } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  spotlight?: boolean;
}

export function GlassCard({
  children,
  className,
  glowColor = "rgba(139, 92, 246, 0.15)", // Премиальный фиолетовый
  spotlight = true,
  ...props
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!spotlight || !cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    cardRef.current.style.setProperty("--mouse-x", `${x}px`);
    cardRef.current.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-950/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-white/10",
        className
      )}
      {...props}
    >
      {spotlight && (
        <div
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(
              250px circle at var(--mouse-x, 0px) var(--mouse-y, 0px),
              ${glowColor},
              transparent 80%
            )`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
