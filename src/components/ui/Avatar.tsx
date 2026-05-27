"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const avatarVariants = cva(
  "inline-flex items-center justify-center shrink-0 select-none overflow-hidden transition-all duration-200",
  {
    variants: {
      variant: {
        workspace: "rounded-lg bg-gradient-to-tr text-white shadow font-bold",
        user: "rounded-full border border-white/10 bg-zinc-800 text-zinc-100 font-semibold",
        gradient: "rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white shadow font-bold",
      },
      size: {
        sm: "h-6 w-6 text-[10px]",
        md: "h-8 w-8 text-sm",
        lg: "h-16 w-16 text-xl",
      },
      theme: {
        purple: "from-violet-600 to-fuchsia-500",
        blue: "from-blue-600 to-cyan-500",
        amber: "from-amber-500 to-orange-600",
      },
    },
    defaultVariants: {
      variant: "user",
      size: "md",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  initials: string;
}

export function Avatar({ className, variant, size, theme, initials, ...props }: AvatarProps) {
  return (
    <div
      className={cn(avatarVariants({ variant, size, theme: variant === "workspace" ? theme : undefined, className }))}
      {...props}
    >
      {initials.toUpperCase()}
    </div>
  );
}
