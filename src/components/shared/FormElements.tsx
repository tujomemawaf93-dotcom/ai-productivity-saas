"use client";

import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Button Variants с использованием Class Variance Authority (CVA)
export const buttonVariants = cva(
  "relative inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95",
  {
    variants: {
      variant: {
        primary: "bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 border border-violet-500/20 rounded-lg",
        secondary: "bg-zinc-900 border border-white/5 text-zinc-100 hover:bg-zinc-800 hover:text-white rounded-lg",
        ghost: "text-zinc-400 hover:bg-white/5 hover:text-white rounded-lg",
        destructive: "bg-red-950/40 border border-red-500/20 text-red-200 hover:bg-red-900/50 rounded-lg",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={cn(buttonVariants({ variant, size, className }))}
        {...(props as any)}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

// Input component
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, type = "text", ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-lg border border-white/5 bg-zinc-950/40 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 transition-all duration-200 focus:border-violet-500 focus:bg-zinc-950/60 focus:outline-none focus:ring-1 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";
