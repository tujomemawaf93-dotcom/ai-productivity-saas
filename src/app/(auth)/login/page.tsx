"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, Mail, Lock } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button, Input } from "@/components/shared/FormElements";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Имитация входа для MVP
    setTimeout(() => {
      if (email && password) {
        setIsLoading(false);
        // Перенаправляем во временный workspace
        router.push("/default-workspace");
      } else {
        setIsLoading(false);
        setError("Пожалуйста, заполните все поля.");
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Brand Logo Header */}
      <div className="flex flex-col items-center mb-8 text-center">
        <motion.div 
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 shadow-md shadow-violet-500/20 mb-4 cursor-pointer"
        >
          {/* Delta Icon */}
          <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 3L2 21h20L12 3z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 9l-5 9h10l-5-9z" fill="currentColor" opacity="0.3" />
          </svg>
        </motion.div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">
          Aether <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">OS</span>
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Войдите в ваше интеллектуальное пространство
        </p>
      </div>

      <GlassCard className="p-8 border-white/5 bg-zinc-950/40 relative">
        <form onSubmit={handleLogin} className="space-y-5">
          <Input
            label="Email"
            placeholder="name@company.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="pl-3"
          />

          <div className="relative space-y-1">
            <Input
              label="Пароль"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-red-400"
            >
              {error}
            </motion.p>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer">
              <input type="checkbox" className="rounded border-white/10 bg-zinc-950/60 text-violet-600 focus:ring-violet-500/30" />
              <span>Запомнить меня</span>
            </label>
            <Link href="#" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
              Забыли пароль?
            </Link>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Войти в систему
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/5" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-950 px-3 text-zinc-500">или продолжить с</span>
          </div>
        </div>

        {/* Social Authentication */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            className="flex items-center justify-center space-x-2 rounded-lg border border-white/5 bg-zinc-900/40 py-2.5 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60 hover:text-white transition-all duration-200"
          >
            {/* Google Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            <span>Google</span>
          </button>
          
          <button 
            type="button"
            className="flex items-center justify-center space-x-2 rounded-lg border border-white/5 bg-zinc-900/40 py-2.5 px-4 text-sm font-medium text-zinc-200 hover:bg-zinc-800/60 hover:text-white transition-all duration-200"
          >
            {/* GitHub Icon */}
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>
      </GlassCard>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Нет аккаунта?{" "}
        <Link href="/register" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold">
          Создать бесплатно
        </Link>
      </p>
    </motion.div>
  );
}
