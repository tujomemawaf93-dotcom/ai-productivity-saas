"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Check } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button, Input } from "@/components/shared/FormElements";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Имитация создания аккаунта для MVP
    setTimeout(() => {
      if (name && email && password) {
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
          Создать аккаунт
        </h1>
        <p className="mt-1.5 text-sm text-zinc-400">
          Начните бесплатно проектировать свой рабочий день
        </p>
      </div>

      <GlassCard className="p-8 border-white/5 bg-zinc-950/40 relative">
        <form onSubmit={handleRegister} className="space-y-5">
          <Input
            label="Имя и Фамилия"
            placeholder="Алексей Иванов"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="pl-3"
          />

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
              placeholder="Минимум 8 символов"
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

          <div className="flex items-start space-x-2 text-xs">
            <input 
              type="checkbox" 
              required 
              id="terms"
              className="mt-0.5 rounded border-white/10 bg-zinc-950/60 text-violet-600 focus:ring-violet-500/30" 
            />
            <label htmlFor="terms" className="text-zinc-400 cursor-pointer select-none">
              Я соглашаюсь с{" "}
              <Link href="#" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Условиями обслуживания
              </Link>
              {" "}и{" "}
              <Link href="#" className="text-violet-400 hover:text-violet-300 transition-colors font-medium">
                Политикой конфиденциальности
              </Link>
            </label>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Создать Workspace
          </Button>
        </form>
      </GlassCard>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="text-violet-400 hover:text-violet-300 transition-colors font-semibold">
          Войти
        </Link>
      </p>
    </motion.div>
  );
}
