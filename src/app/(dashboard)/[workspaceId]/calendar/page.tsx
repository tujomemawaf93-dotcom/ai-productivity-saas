"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users,
  CheckCircle2,
  RefreshCw
} from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  day: number;
  type: "meeting" | "task" | "design";
  colorClass: string;
  borderClass: string;
}

export default function CalendarPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [currentMonth, setCurrentMonth] = useState("Май 2026");
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "AI Core Architecture Review",
      time: "14:00 - 15:00",
      day: 15,
      type: "meeting",
      colorClass: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      borderClass: "border-l-violet-500"
    },
    {
      id: "2",
      title: "Синхронизация по дизайну",
      time: "16:30 - 17:15",
      day: 15,
      type: "design",
      colorClass: "bg-pink-500/10 text-pink-400 border-pink-500/20",
      borderClass: "border-l-pink-500"
    },
    {
      id: "3",
      title: "Деплой фичи Edge Caching",
      time: "10:00 - 11:30",
      day: 18,
      type: "task",
      colorClass: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      borderClass: "border-l-emerald-500"
    },
    {
      id: "4",
      title: "1-on-1 CTO & Frontend Architect",
      time: "11:00 - 11:45",
      day: 20,
      type: "meeting",
      colorClass: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      borderClass: "border-l-blue-500"
    }
  ]);

  const handleAddEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: "Новое событие",
      time: "12:00 - 13:00",
      day: 15,
      type: "meeting",
      colorClass: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      borderClass: "border-l-zinc-500"
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  // Генерируем дни месяца (Май 2026 начинается с пятницы, 1 число)
  const daysInMonth = 31;
  const startOffset = 4; // Пн, Вт, Ср, Чт пустые
  const calendarDays = [];

  for (let i = 0; i < startOffset; i++) {
    calendarDays.push({ dayNumber: null, isCurrentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ dayNumber: i, isCurrentMonth: true });
  }

  return (
    <PageContainer
      title="Интеллектуальный Календарь"
      description="Планируйте свое время, связывайте встречи с задачами и используйте ИИ-рекомендации расписания"
      action={
        <div className="flex space-x-2">
          <Button variant="secondary" size="sm" className="flex items-center space-x-1">
            <RefreshCw className="h-3.5 w-3.5 text-zinc-400" />
            <span>Синхронизировать</span>
          </Button>
          <Button onClick={handleAddEvent} className="flex items-center space-x-1.5">
            <Plus className="h-4 w-4" />
            <span>Добавить событие</span>
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Agenda view & Filters */}
        <div className="lg:col-span-1 space-y-4">
          <GlassCard className="p-4 flex flex-col justify-between" glowColor="rgba(16, 185, 129, 0.1)">
            <div>
              <div className="flex items-center space-x-2 border-b border-white/5 pb-3 mb-4 text-emerald-400">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-xs font-semibold uppercase tracking-wider">Повестка недели</span>
              </div>

              <div className="space-y-4">
                {events.map((evt) => (
                  <div 
                    key={evt.id} 
                    className={cn(
                      "p-3 rounded-lg border border-white/5 border-l-2 bg-zinc-950/40 hover:bg-white/5 transition-all duration-200",
                      evt.borderClass
                    )}
                  >
                    <p className="text-xs font-semibold text-zinc-200 truncate">{evt.title}</p>
                    <div className="flex items-center space-x-1.5 mt-2 text-xxs text-zinc-500">
                      <Clock className="h-3 w-3" />
                      <span>День {evt.day}, {evt.time}</span>
                    </div>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="flex items-center text-xxs text-zinc-400">
                        <Video className="h-3 w-3 mr-1 text-violet-400" /> Google Meet
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Right Side: Calendar Matrix */}
        <div className="lg:col-span-3 space-y-4">
          {/* Calendar Header with navigation */}
          <div className="flex justify-between items-center p-3 rounded-xl border border-white/5 bg-zinc-950/40">
            <span className="text-sm font-semibold text-zinc-200">{currentMonth}</span>
            <div className="flex items-center space-x-1">
              <button className="p-1 rounded-md border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="p-1 rounded-md border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white transition-colors">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Calendar Matrix Grid */}
          <div className="rounded-xl border border-white/5 bg-zinc-950/30 overflow-hidden shadow-2xl">
            {/* Weekdays names */}
            <div className="grid grid-cols-7 border-b border-white/5 bg-zinc-950/50 text-center text-xxs font-semibold uppercase tracking-wider text-zinc-500 py-3">
              <div>Пн</div>
              <div>Вт</div>
              <div>Ср</div>
              <div>Чт</div>
              <div>Пт</div>
              <div>Сб</div>
              <div>Вс</div>
            </div>

            {/* Days cells */}
            <div className="grid grid-cols-7 auto-rows-[100px] divide-x divide-y divide-white/5 bg-zinc-950/20">
              {calendarDays.map((cell, idx) => {
                const dayEvents = events.filter((e) => e.day === cell.dayNumber);
                const isToday = cell.dayNumber === 15; // Mock today focus day

                return (
                  <div 
                    key={idx} 
                    className={cn(
                      "p-1.5 relative flex flex-col justify-between group hover:bg-white/[0.01] transition-colors",
                      !cell.isCurrentMonth && "bg-transparent text-zinc-700 pointer-events-none"
                    )}
                  >
                    {/* Day number */}
                    {cell.dayNumber && (
                      <span className={cn(
                        "text-xs font-semibold h-5 w-5 rounded-full flex items-center justify-center self-start",
                        isToday ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20" : "text-zinc-500 group-hover:text-zinc-300"
                      )}>
                        {cell.dayNumber}
                      </span>
                    )}

                    {/* Mini event badges inside cell */}
                    <div className="space-y-1 overflow-hidden mt-1.5">
                      {dayEvents.map((e) => (
                        <div 
                          key={e.id}
                          className={cn(
                            "px-1.5 py-0.5 rounded border text-[9px] font-semibold truncate cursor-pointer",
                            e.colorClass
                          )}
                        >
                          {e.title}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
