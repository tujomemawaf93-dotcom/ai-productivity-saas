"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center px-2 py-0.5 rounded text-xxs font-semibold border shrink-0 transition-colors",
  {
    variants: {
      variant: {
        product: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        engineering: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        design: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        zinc: "text-zinc-400 bg-zinc-500/10 border-zinc-500/20",
      },
    },
    defaultVariants: {
      variant: "zinc",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant, className }))}
      {...props}
    />
  );
}
