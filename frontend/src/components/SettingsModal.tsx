"use client";

import React, { useState } from "react";
import { 
  X, 
  Sun, 
  Moon, 
  Monitor, 
  Shield, 
  RefreshCw, 
  Database, 
  Check, 
  SlidersHorizontal,
  Palette,
  Sparkles,
  ReceiptText,
  Bell,
  Cpu,
  Layers,
  Zap,
  TrendingDown,
  CheckCircle2,
  DollarSign
} from "lucide-react";

export interface SettingsState {
  theme: "light" | "dark";
  broker: string;
  riskScore: number;
  maxSectorCap: number;
  aiModel: string;
  taxRegime: string;
  autoRefreshSec: number;
  compactMode: boolean;
  notificationsEnabled: boolean;
  currency: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: SettingsState;
  onUpdateSettings: (newSettings: Partial<SettingsState>) => void;
  onTriggerSync?: () => void;
}

type TabType = "appearance" | "broker" | "risk" | "ai" | "tax" | "notifications";

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onTriggerSync
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("appearance");
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSync = () => {
    setIsSyncing(true);
    if (onTriggerSync) onTriggerSync();
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "appearance", label: "Appearance & UX", icon: <Palette className="w-4 h-4" /> },
    { id: "broker", label: "Broker & Data Sync", icon: <Database className="w-4 h-4" /> },
    { id: "risk", label: "Risk & Guardrails", icon: <Shield className="w-4 h-4" /> },
    { id: "ai", label: "AI Co-Pilot & RAG", icon: <Cpu className="w-4 h-4" /> },
    { id: "tax", label: "Tax & Compliance", icon: <ReceiptText className="w-4 h-4" /> },
    { id: "notifications", label: "Alerts & Push", icon: <Bell className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-900/90 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between flex-shrink-0">
          <div>
            {/* Header branding */}
            <div className="flex items-center space-x-2.5 mb-6 px-2 pt-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <SlidersHorizontal className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                  Platform Settings
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  NiveshDristi v2.0 Suite
                </p>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick status footer in sidebar */}
          <div className="hidden md:block p-3 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-[11px] mt-4">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1 font-medium">
              <span>Active Broker</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{settings.broker}</span>
            </div>
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 font-medium">
              <span>Risk Score</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold">{settings.riskScore}/10</span>
            </div>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900">
          
          {/* Header Bar */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Configure your workspace preferences and financial safety parameters.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="p-6 space-y-6 overflow-y-auto flex-1">
            
            {/* TAB 1: APPEARANCE & UX */}
            {activeTab === "appearance" && (
              <div className="space-y-6">
                
                {/* Theme Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Interface Theme Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ theme: "light" })}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        settings.theme === "light"
                          ? "bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-500/20 text-slate-900 shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Sun className="w-4 h-4 fill-amber-500 text-amber-500" />
                        </div>
                        {settings.theme === "light" && (
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">Light Mode (Default)</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Clean slate background with high readability</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateSettings({ theme: "dark" })}
                      className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition cursor-pointer ${
                        settings.theme === "dark"
                          ? "bg-slate-800 border-indigo-500 ring-2 ring-indigo-500/20 text-white shadow-xs"
                          : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-900/80 text-indigo-400 flex items-center justify-center">
                          <Moon className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                        </div>
                        {settings.theme === "dark" && (
                          <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white">Midnight Dark Navy</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Sleek dark navy palette for low light</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Display Currency */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Primary Currency Symbol
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {["₹ INR", "$ USD"].map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => onUpdateSettings({ currency: c })}
                        className={`p-3 rounded-xl border text-xs font-extrabold transition cursor-pointer ${
                          settings.currency === c
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-300"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compact Density */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Compact Table Mode</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Reduce table row padding for high-density portfolio data</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ compactMode: !settings.compactMode })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.compactMode ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      settings.compactMode ? "left-7" : "left-1"
                    }`} />
                  </button>
                </div>

              </div>
            )}

            {/* TAB 2: BROKER & DATA SYNC */}
            {activeTab === "broker" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Connected Demat / Broker API
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {["Zerodha Kite", "Groww", "Upstox", "AngelOne", "ICICI Direct"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => onUpdateSettings({ broker: b })}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          settings.broker === b
                            ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/20 text-indigo-900 dark:text-indigo-300 font-black shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:border-slate-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">{b}</span>
                          {settings.broker === b && <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                          {settings.broker === b ? "API Connected ✓" : "OAuth Ready"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Auto-Refresh Frequency */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Auto-Refresh Frequency
                    </label>
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                      Every {settings.autoRefreshSec}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={300}
                    step={5}
                    value={settings.autoRefreshSec}
                    onChange={(e) => onUpdateSettings({ autoRefreshSec: Number(e.target.value) })}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>5 sec (Realtime)</span>
                    <span>60 sec</span>
                    <span>5 min (Battery saver)</span>
                  </div>
                </div>

                {/* Manual Sync Trigger */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Manual Portfolio Re-sync</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Force pull latest holdings & market quotes from backend server</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSync}
                    disabled={isSyncing}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                    <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: RISK & GUARDRAILS */}
            {activeTab === "risk" && (
              <div className="space-y-6">
                
                {/* Risk Profile Selection */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Target Risk Tolerance Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { score: 3, label: "Conservative", desc: "Capital Preservation" },
                      { score: 6, label: "Moderate", desc: "Balanced Growth" },
                      { score: 9, label: "Aggressive", desc: "High Momentum" },
                    ].map((r) => (
                      <button
                        key={r.score}
                        type="button"
                        onClick={() => onUpdateSettings({ riskScore: r.score })}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          settings.riskScore === r.score
                            ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/20 text-emerald-900 dark:text-emerald-300 font-extrabold shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-extrabold">{r.label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-normal mt-0.5">{r.desc}</div>
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-2">{r.score}/10 Risk Score</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max Sector Cap Slider */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Max Sector Exposure Cap</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Triggers Smart Swap alert if any sector exceeds this threshold</div>
                    </div>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800">
                      {settings.maxSectorCap}% Max
                    </span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={40}
                    step={1}
                    value={settings.maxSectorCap}
                    onChange={(e) => onUpdateSettings({ maxSectorCap: Number(e.target.value) })}
                    className="w-full accent-rose-600 cursor-pointer"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span>15% (Strict Diversification)</span>
                    <span>25% (Standard Default)</span>
                    <span>40% (Concentrated Portfolio)</span>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 4: AI CO-PILOT & RAG */}
            {activeTab === "ai" && (
              <div className="space-y-6">
                
                {/* AI Model Engine Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    AI LLM Reasoner Engine
                  </label>
                  <div className="space-y-2.5">
                    {[
                      { id: "Gemini 1.5 Pro", name: "Google Gemini 1.5 Pro", desc: "Ultra-fast RAG vector retrieval & structured reasoning (Default)" },
                      { id: "GPT-4o Financial", name: "OpenAI GPT-4o Financial", desc: "Advanced macroeconomic & earnings sentiment evaluation" },
                      { id: "Local FinBERT RAG", name: "NiveshDristi Local FinBERT RAG", desc: "Privacy-first offline local tensor inference engine" },
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => onUpdateSettings({ aiModel: m.id })}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                          settings.aiModel === m.id
                            ? "bg-teal-50 dark:bg-teal-950/60 border-teal-500 ring-2 ring-teal-500/20 text-teal-900 dark:text-teal-300 font-bold"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <div>
                          <div className="text-xs font-black text-slate-900 dark:text-white">{m.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{m.desc}</div>
                        </div>
                        {settings.aiModel === m.id && (
                          <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: TAX & COMPLIANCE */}
            {activeTab === "tax" && (
              <div className="space-y-6">
                
                {/* Tax Regime Selector */}
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Tax Harvesting Regime (Indian Income Tax)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "Section 112A / 111A", title: "Standard FY25 Regime", desc: "12.5% LTCG (>₹1.25L) & 20% STCG" },
                      { id: "Indexation Exemption", title: "Legacy Property / Debt", desc: "Grandfathered cost indexation rules" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onUpdateSettings({ taxRegime: t.id })}
                        className={`p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                          settings.taxRegime === t.id
                            ? "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-900 dark:text-indigo-300 font-bold shadow-xs"
                            : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-black">{t.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{t.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 6: NOTIFICATIONS */}
            {activeTab === "notifications" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Push & In-App Risk Alerts</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Receive instant alerts when sector exposure exceeds {settings.maxSectorCap}% threshold</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settings.notificationsEnabled ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      settings.notificationsEnabled ? "left-7" : "left-1"
                    }`} />
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex items-center justify-between flex-shrink-0">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Changes apply instantly across dashboard views.
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              Save & Apply Settings
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
