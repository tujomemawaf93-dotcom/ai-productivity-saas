"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useSignUp } from "@clerk/nextjs/legacy";

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleRegister = async (e: React.MouseEvent | React.FormEvent) => {
    e.preventDefault();

    if (!isLoaded || !signUp) {
      setError("Clerk всё ещё загружается! Пожалуйста, подождите.");
      return;
    }

    if (!name || !email || !password) {
      setError("Пожалуйста, заполните Имя, Email и Пароль.");
      return;
    }

    if (!acceptedTerms) {
      setError("Вы должны согласиться с Условиями обслуживания.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      console.log("Отправляем регистрацию в Clerk...");
      const result = await signUp.create({
        emailAddress: email,
        password: password,
        firstName: name.split(" ")[0] || name,
        lastName: name.split(" ")[1] || "",
      });

      if (result.status === "complete") {
        if (setActive) {
          await setActive({ session: result.createdSessionId });
          setIsLoading(false);
          // Использование window.location гарантирует, что сессионные куки Clerk
          // будут сразу же обработаны прокси-сервером на бэкенде без зависания роутера Next.js
          window.location.href = "/";
        }
      } else if (result.status === "missing_requirements") {
        setIsLoading(false);
        setError("Внимание! Clerk требует подтвердить Email (ввести код с почты). Зайдите в дашборд Clerk -> Configure -> Email, Phone, Webhooks -> и отключите 'Email Verification', чтобы пускало сразу!");
      } else {
        setIsLoading(false);
        setError(`Требуется подтверждение: ${result.status}`);
      }
    } catch (err: any) {
      setIsLoading(false);
      console.error("Ошибка Clerk:", err);
      const errorMsg = err.errors?.[0]?.message || err.message || "Ошибка регистрации.";
      setError(errorMsg);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex flex-col items-center mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-sans">Создать аккаунт</h1>
      </div>

      <GlassCard className="p-8 border-white/5 bg-zinc-950/40 relative overflow-hidden">
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/85 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600/10 to-fuchsia-500/10 border border-violet-500/30 shadow-lg shadow-violet-500/10 mb-3 animate-pulse">
                <ShieldCheck className="h-6 w-6 text-violet-400" />
              </div>
              <p className="text-xs font-semibold text-zinc-300">Регистрация...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister} className="space-y-5">
          <Input
            label="Имя и Фамилия"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative space-y-1">
            <Input
              label="Пароль"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-zinc-500 hover:text-zinc-300"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          {error && <motion.p className="text-xs text-red-400">{error}</motion.p>}

          <div className="flex items-start space-x-2 text-xs">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-0.5 rounded cursor-pointer accent-violet-600 bg-zinc-950 border-white/10"
            />
            <label htmlFor="terms" className="text-zinc-400 cursor-pointer select-none">
              Я соглашаюсь с Условиями обслуживания
            </label>
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full">
            Создать Workspace
          </Button>
        </form>
      </GlassCard>
    </motion.div>
  );
}