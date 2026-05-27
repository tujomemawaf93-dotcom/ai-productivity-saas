"use client";

import React from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  ArrowUpRight, 
  Zap, 
  Users,
  Activity,
  ArrowDownRight
} from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/shared/FormElements";

export default function AnalyticsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const logs = [
    { id: 1, name: "ИИ скомпилировал сводку PRD", time: "10 мин назад", status: "success" },
    { id: 2, name: "Синхронизировано 12 задач из Slack", time: "1ч назад", status: "success" },
    { id: 3, name: "Автоматически запланирована встреча с дизайнером", time: "4ч назад", status: "success" },
  ];

  return (
    <PageContainer
      title="Аналитика Продуктивности"
      description="Глубокий анализ вашей рабочей активности, времени фокуса и интеллектуальных инсайтов Aether AI"
      action={
        <Button variant="secondary" size="sm" className="flex items-center space-x-1">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          <span>Экспорт отчета</span>
        </Button>
      }
    >
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { title: "Focus Score", val: "92%", diff: "+8% на этой неделе", icon: Zap, color: "text-violet-400 border-violet-500/20", glow: "rgba(139, 92, 246, 0.1)" },
          { title: "Задачи выполнены", val: "48 / 60", diff: "Выполнено 80% плана", icon: CheckCircle2, color: "text-emerald-400 border-emerald-500/20", glow: "rgba(16, 185, 129, 0.1)" },
          { title: "Сэкономлено времени ИИ", val: "8.4ч", diff: "+2.1ч по сравнению с Пн", icon: Sparkles, color: "text-amber-400 border-amber-500/20", glow: "rgba(245, 158, 11, 0.1)" },
          { title: "Активные часы", val: "42.5ч", diff: "-1.5ч (оптимизация)", icon: Clock, color: "text-blue-400 border-blue-500/20", glow: "rgba(59, 130, 246, 0.1)" },
        ].map((s, idx) => {
          const Icon = s.icon;
          return (
            <GlassCard key={idx} className="p-5" glowColor={s.glow}>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xxs font-semibold uppercase tracking-wider text-zinc-500">{s.title}</span>
                <Icon className={`h-4 w-4 ${s.color.split(" ")[0]}`} />
              </div>
              <h3 className="text-2xl font-bold text-white font-sans">{s.val}</h3>
              <p className="text-xxs text-zinc-500 mt-1">{s.diff}</p>
            </GlassCard>
          );
        })}
      </div>

      {/* Main Charts area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Productivity Flow Grid Graph */}
        <div className="lg:col-span-2">
          <GlassCard className="p-6 h-[380px] flex flex-col justify-between" glowColor="rgba(139, 92, 246, 0.1)">
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2 text-zinc-300">
                  <Activity className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Интеллектуальная активность</span>
                </div>
                <span className="text-xxs text-zinc-500">Май 2026</span>
              </div>
              <p className="text-xxs text-zinc-400 max-w-lg mb-6">
                Показывает распределение времени глубокой сфокусированной работы по дням недели.
              </p>
            </div>

            {/* Custom SVG line graph representation */}
            <div className="flex-1 w-full h-36 relative mt-4">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 120">
                <defs>
                  <linearGradient id="glowGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3"/>
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                {/* Horizontal lines */}
                <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                
                {/* SVG glowing path */}
                <path
                  d="M 10 100 Q 80 80 150 40 T 290 20 T 430 80 T 490 30"
                  fill="none"
                  stroke="url(#accentGrad)"
                  strokeWidth="3.5"
                  className="stroke-violet-500 filter drop-shadow-[0_2px_8px_rgba(139,92,246,0.5)]"
                />
                
                {/* Gradient area under the line */}
                <path
                  d="M 10 100 Q 80 80 150 40 T 290 20 T 430 80 T 490 30 L 490 120 L 10 120 Z"
                  fill="url(#glowGrad)"
                />
                
                {/* Interactive points */}
                <circle cx="150" cy="40" r="4.5" className="fill-violet-400 stroke-zinc-950 stroke-2" />
                <circle cx="290" cy="20" r="4.5" className="fill-fuchsia-400 stroke-zinc-950 stroke-2" />
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider px-2 border-t border-white/5 pt-4 mt-4">
              <span>Пн</span>
              <span>Вт</span>
              <span>Ср</span>
              <span>Чт</span>
              <span>Пт</span>
              <span>Сб</span>
              <span>Вс</span>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: circular SVGs & audit log */}
        <div className="lg:col-span-1 space-y-6">
          <GlassCard className="p-6 h-[380px] flex flex-col justify-between" glowColor="rgba(244, 63, 94, 0.1)">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Соотношение фокуса</span>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">+12.4%</span>
              </div>
              <p className="text-xxs text-zinc-500 mb-6">Время, разделенное по типам задач.</p>
            </div>

            {/* Circular focus SVG ring */}
            <div className="flex justify-center items-center h-32 relative">
              <svg className="w-32 h-32 transform -rotate-90">
                {/* Base circle */}
                <circle cx="64" cy="64" r="50" fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                {/* Progress circle */}
                <circle 
                  cx="64" 
                  cy="64" 
                  r="50" 
                  fill="transparent" 
                  stroke="#8b5cf6" 
                  strokeWidth="8" 
                  strokeDasharray="314"
                  strokeDashoffset="70"
                  className="stroke-violet-500 stroke-linecap-round filter drop-shadow-[0_0_6px_rgba(139,92,246,0.3)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-white font-sans">82%</span>
                <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Глубокий фокус</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-xxs">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-violet-500" />
                  <span className="text-zinc-400">Глубокий фокус</span>
                </div>
                <span className="font-semibold text-zinc-200">82% (34.8ч)</span>
              </div>
              <div className="flex justify-between items-center text-xxs">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span className="text-zinc-400">Встречи / Звонки</span>
                </div>
                <span className="font-semibold text-zinc-200">12% (5.1ч)</span>
              </div>
              <div className="flex justify-between items-center text-xxs">
                <div className="flex items-center space-x-1.5">
                  <span className="h-2 w-2 rounded-full bg-zinc-700" />
                  <span className="text-zinc-400">Рутина</span>
                </div>
                <span className="font-semibold text-zinc-200">6% (2.6ч)</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
