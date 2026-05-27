"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User, 
  Settings, 
  Sparkles, 
  Bell, 
  ShieldAlert, 
  Save,
  Key,
  Eye,
  EyeOff,
  Sliders
} from "lucide-react";
import { PageContainer } from "@/components/ui/PageContainer";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const params = useParams();
  const workspaceId = params.workspaceId as string;

  const [activeTab, setActiveTab] = useState("profile");
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("AIzaSyD-mock-gemini-key-1cbb7d3c");
  const [temperature, setTemperature] = useState(0.7);

  // Profile data mock state
  const [profileName, setProfileName] = useState("John Doe");
  const [profileEmail, setProfileEmail] = useState("john@aether.os");

  // Workspace mock state
  const [wsName, setWsName] = useState("Design Synapse");
  const [wsSlug, setWsSlug] = useState(workspaceId || "design-synapse");

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1200);
  };

  return (
    <PageContainer
      title="Настройки"
      description="Управляйте профилем, рабочей областью, правами доступа и интеграцией искусственного интеллекта Gemini"
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Side: Settings Sub-Tabs */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-white/5 bg-zinc-950/40 p-2 space-y-1">
            {[
              { id: "profile", name: "Личный профиль", icon: User },
              { id: "workspace", name: "Рабочая область", icon: Settings },
              { id: "ai", name: "Настройки ИИ & Ключи", icon: Sparkles },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "flex w-full items-center space-x-2.5 rounded-lg px-3 py-2 text-left text-sm transition-all duration-200",
                    isActive ? "bg-white/5 text-white font-medium" : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-violet-400" : "text-zinc-500")} />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Active Settings Panel Editor */}
        <div className="lg:col-span-3">
          <GlassCard className="p-6" glowColor="rgba(139, 92, 246, 0.1)">
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* TAB 1: Profile Settings */}
              {activeTab === "profile" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3 mb-2">
                    <h3 className="text-base font-bold text-white font-sans">Личный профиль</h3>
                    <p className="text-xxs text-zinc-500 mt-0.5">Информация вашего аккаунта Aether OS.</p>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <Avatar variant="gradient" size="lg" initials="JD" />
                    <Button variant="secondary" size="sm" type="button">Сменить фото</Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Имя и Фамилия"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Workspace Settings */}
              {activeTab === "workspace" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3 mb-2">
                    <h3 className="text-base font-bold text-white font-sans">Параметры Workspace</h3>
                    <p className="text-xxs text-zinc-500 mt-0.5">Настройки организации и ссылки общего доступа.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Название воркспейса"
                      value={wsName}
                      onChange={(e) => setWsName(e.target.value)}
                    />
                    <Input
                      label="Slug (Идентификатор)"
                      value={wsSlug}
                      onChange={(e) => setWsSlug(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: AI Configuration Settings */}
              {activeTab === "ai" && (
                <div className="space-y-5">
                  <div className="border-b border-white/5 pb-3 mb-2">
                    <h3 className="text-base font-bold text-white font-sans">Интеграция ИИ Gemini</h3>
                    <p className="text-xxs text-zinc-500 mt-0.5">Индивидуальные настройки личных API-ключей Google AI Studio.</p>
                  </div>

                  {/* Gemini API Key input */}
                  <div className="relative space-y-1">
                    <Input
                      label="Gemini API Key"
                      placeholder="AIzaSy..."
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-[34px] text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Temperature slider widget */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold uppercase tracking-wider text-zinc-400 flex items-center">
                        <Sliders className="h-3.5 w-3.5 mr-1.5 text-violet-400" /> Креативность (Temperature)
                      </span>
                      <span className="font-mono text-zinc-200">{temperature}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-violet-600 bg-zinc-800 rounded-lg h-2 cursor-pointer appearance-none"
                    />
                    <p className="text-[10px] text-zinc-500">
                      Меньшие значения делают ИИ более точным и фактологичным, большие — креативным.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons footer inside card */}
              <div className="border-t border-white/5 pt-4 flex justify-end">
                <Button type="submit" isLoading={isSaving} className="flex items-center space-x-1.5">
                  <Save className="h-4 w-4" />
                  <span>Сохранить изменения</span>
                </Button>
              </div>

            </form>
          </GlassCard>
        </div>
      </div>
    </PageContainer>
  );
}
