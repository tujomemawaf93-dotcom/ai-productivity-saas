"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { 
  Sparkles, 
  Calendar as CalendarIcon, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  ArrowUpRight,
  Plus, 
  CornerDownLeft,
  Timer,
  Zap,
  Activity,
  PlusCircle,
  HelpCircle,
  BrainCircuit,
  Eye,
  Trash
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/ui/PageContainer";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

// Импортируем компоненты Recharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Данные для графика
const chartData = [
  { name: "Пн", focus: 65, tasks: 4 },
  { name: "Вт", focus: 72, tasks: 5 },
  { name: "Ср", focus: 60, tasks: 3 },
  { name: "Чт", focus: 85, tasks: 7 },
  { name: "Пт", focus: 92, tasks: 8 },
  { name: "Сб", focus: 78, tasks: 6 },
  { name: "Вс", focus: 88, tasks: 5 },
];

const tagVariants: Record<string, "product" | "engineering" | "design" | "amber" | "zinc"> = {
  Product: "product",
  Engineering: "engineering",
  Design: "design",
  Marketing: "amber",
  General: "zinc"
};

export default function WorkspaceDashboardPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const [recentNotes, setRecentNotes] = useState([
    { id: 1, title: "Product Requirements Document (PRD)", time: "2 мин назад", tag: "Product" },
    { id: 2, title: "Архитектура Векторного Поиска", time: "1 час назад", tag: "Engineering" },
    { id: 3, title: "Редизайн Дизайн-Системы (v2.0)", time: "Вчера", tag: "Design" },
  ]);

  const [activities, setActivities] = useState([
    { id: 1, text: "Вы обновили заметку PRD", time: "5 мин назад" },
    { id: 2, text: "Aether AI оптимизировал Календарь на Чт", time: "1ч назад" },
    { id: 3, text: "Выполнена задача: Настройка GlassCard", time: "2ч назад" },
  ]);

  // Контейнер для каскадной анимации виджетов
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      } 
    }
  };

  const handleQuickAddActivity = () => {
    const newAct = {
      id: Date.now(),
      text: "Создан новый документ проекта",
      time: "Только что"
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  return (
    <PageContainer
      title="С возвращением, Джон! ⚡️"
      description={`Вся интеллектуальная аналитика пространства ${workspaceId} под полным контролем`}
      action={
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center space-x-1.5">
          <Plus className="h-4 w-4" />
          <span>Быстрое действие</span>
        </Button>
      }
    >
      {/* 1. TOP STATS ROW */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {[
          { title: "Focus Score", val: "92%", diff: "+12.4% от нормы", icon: Zap, color: "text-violet-400", glow: "rgba(139, 92, 246, 0.1)" },
          { title: "Задачи в работе", val: "8 Активных", diff: "3 дедлайна сегодня", icon: CheckSquare, color: "text-emerald-400", glow: "rgba(16, 185, 129, 0.1)" },
          { title: "ИИ Эффективность", val: "99.8%", diff: "Сэкономлено 8.4 часов", icon: Sparkles, color: "text-amber-400", glow: "rgba(245, 158, 11, 0.1)" },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <GlassCard key={idx} className="p-5 flex flex-col justify-between" glowColor={s.glow}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xxs font-semibold uppercase tracking-wider text-zinc-500">{s.title}</span>
                <Icon className={cn("h-4 w-4", s.color)} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-sans">{s.val}</h3>
                <p className="text-xxs text-zinc-500 mt-1">{s.diff}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* 2. GRID LAYOUT */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        {/* Left/Center Area (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CHART WIDGET */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 h-[340px] flex flex-col justify-between" glowColor="rgba(139, 92, 246, 0.1)">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-2 text-zinc-300">
                    <Activity className="h-4 w-4 text-violet-400" />
                    <span className="text-xs font-semibold uppercase tracking-wider">График продуктивности</span>
                  </div>
                  <span className="text-xxs text-zinc-500">За последние 7 дней</span>
                </div>
              </div>

              {/* Responsive Container for Recharts */}
              <div className="flex-1 w-full h-48 mt-4">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" />
                      <XAxis 
                        dataKey="name" 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#71717a" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "#09090b", 
                          borderColor: "rgba(255,255,255,0.08)", 
                          borderRadius: "8px",
                          color: "#fff",
                          fontSize: "12px"
                        }} 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="focus" 
                        stroke="#8b5cf6" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorFocus)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full w-full bg-zinc-950/20 animate-pulse rounded-lg" />
                )}
              </div>
            </GlassCard>
          </motion.div>

          {/* RECENT NOTES & DOCS */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6" glowColor="rgba(59, 130, 246, 0.1)">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <FileText className="h-4 w-4 text-blue-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Недавние умные заметки</span>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xxs">Все заметки</Button>
              </div>

              <div className="space-y-3">
                {recentNotes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-3 rounded-lg border border-white/5 bg-zinc-950/60 hover:bg-white/5 cursor-pointer transition-all duration-200 flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-semibold text-zinc-200">{note.title}</p>
                      <p className="text-xxs text-zinc-500 mt-1">Отредактировано {note.time}</p>
                    </div>
                    <Badge variant={tagVariants[note.tag] || "zinc"}>
                      {note.tag}
                    </Badge>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right Sidebar (1 Column) */}
        <div className="space-y-6">
          
          {/* AI INSIGHTS PANEL */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5" glowColor="rgba(245, 158, 11, 0.15)">
              <div className="flex items-center space-x-2 text-zinc-300 border-b border-white/5 pb-3 mb-4">
                <BrainCircuit className="h-4.5 w-4.5 text-amber-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">Aether AI Рекомендации</span>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                  <p className="text-xs font-semibold text-amber-200">💡 Режим высокой загрузки</p>
                  <p className="text-xxs text-zinc-400 mt-1 leading-relaxed">
                    В Четверг запланировано 4 встречи подряд. Я рекомендую перенести архитектурный обзор на Пятницу для повышения сфокусированности.
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-violet-500/5 border border-violet-500/10">
                  <p className="text-xs font-semibold text-violet-200">🔮 ИИ-Сводка готова</p>
                  <p className="text-xxs text-zinc-400 mt-1 leading-relaxed">
                    Сгенерирована новая выжимка по документу PRD. Просмотрите её в чате Aether.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          {/* QUICK ACTIONS PORTAL */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5" glowColor="rgba(139, 92, 246, 0.1)">
              <div className="flex items-center space-x-2 text-zinc-300 border-b border-white/5 pb-3 mb-4">
                <PlusCircle className="h-4.5 w-4.5 text-violet-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">Быстрые действия</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="secondary" onClick={handleQuickAddActivity} className="text-xxs">
                  Создать файл
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsModalOpen(true)} className="text-xxs">
                  Настройки ИИ
                </Button>
              </div>
            </GlassCard>
          </motion.div>

          {/* LIVE ACTIVITY FEED */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5" glowColor="rgba(255, 255, 255, 0.05)">
              <div className="flex items-center space-x-2 text-zinc-300 border-b border-white/5 pb-3 mb-4">
                <Activity className="h-4.5 w-4.5 text-zinc-400" />
                <span className="text-xs font-semibold uppercase tracking-wider">Лента активности</span>
              </div>

              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                {activities.map((act) => (
                  <div key={act.id} className="flex justify-between items-start text-xxs border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                    <span className="text-zinc-300">{act.text}</span>
                    <span className="text-zinc-500 shrink-0 ml-2">{act.time}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

        </div>
      </motion.div>

      {/* 3. DESIGN SYSTEM INTEGRATED MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Быстрые Настройки Воркспейса"
        description="Управление ключевыми ИИ-агентами рабочей области Aether OS"
        footer={
          <div className="flex space-x-2">
            <Button variant="secondary" size="sm" onClick={() => setIsModalOpen(false)}>Отмена</Button>
            <Button size="sm" onClick={() => setIsModalOpen(false)}>Применить</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-zinc-400">
            Здесь вы можете быстро включить или отключить интеллектуальные подсказки для воркспейса **{workspaceId}**.
          </p>

          <div className="p-3 rounded-lg border border-white/5 bg-zinc-950/40 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-200">Авто-оптимизация календаря</span>
              <span className="text-xxs text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded">Вкл</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-zinc-200">Генерация саммари заметок</span>
              <span className="text-xxs text-emerald-400 border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 rounded">Вкл</span>
            </div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
