"use client";

import React from "react";
import { 
  Rocket, 
  Landmark, 
  Layers, 
  TrendingUp, 
  Activity, 
  Zap, 
  ChevronRight, 
  Sparkles, 
  ArrowUpRight,
  ShieldCheck,
  Flame
} from "lucide-react";
import { NavTab } from "@/components/Navbar";

interface GrowwRightSidebarNavProps {
  onSelectTab: (tab: NavTab) => void;
  activeTab?: NavTab;
}

export const GrowwRightSidebarNav: React.FC<GrowwRightSidebarNavProps> = ({
  onSelectTab,
  activeTab = "portfolio",
}) => {
  const products: {
    id: NavTab;
    title: string;
    subtitle: string;
    badge: string;
    badgeColor: string;
    icon: React.ReactNode;
    iconBg: string;
  }[] = [
    {
      id: "ipos",
      title: "IPOs & New Issues",
      subtitle: "Live Grey Market Premium & Allotment",
      badge: "12 Active • GMP +48%",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
      icon: <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      iconBg: "bg-purple-500/10 dark:bg-purple-500/20",
    },
    {
      id: "bonds",
      title: "Fixed Income & Bonds",
      subtitle: "RBI Sovereign Gold Bonds & Corporate NCDs",
      badge: "Yield up to 7.8%",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
      icon: <Landmark className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
      iconBg: "bg-amber-500/10 dark:bg-amber-500/20",
    },
    {
      id: "etfs",
      title: "ETFs & Index Catalog",
      subtitle: "Gold BeES, Nifty 50 & Global Passive Index",
      badge: "150+ Funds",
      badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
      icon: <Layers className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      iconBg: "bg-blue-500/10 dark:bg-blue-500/20",
    },
    {
      id: "screener",
      title: "Stock Screener Hub",
      subtitle: "NSE/BSE 500 Filters, RSI & Technical Signals",
      badge: "Market Screener",
      badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
      icon: <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      iconBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
    },
    {
      id: "indices",
      title: "Indian & Global Indices",
      subtitle: "Nifty 50, Sensex, BankNifty & Nasdaq 100",
      badge: "Live Benchmarks",
      badgeColor: "bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border-teal-200 dark:border-teal-800",
      icon: <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      iconBg: "bg-teal-500/10 dark:bg-teal-500/20",
    },
    {
      id: "intelligence",
      title: "Pro Analytics & Options",
      subtitle: "Stress Shock Testing & Options Screener",
      badge: "5 Advanced Tools",
      badgeColor: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
      icon: <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      iconBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
    },
  ];

  return (
    <aside className="w-full space-y-4">
      {/* Groww Style Sidebar Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
                Explore Products
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Direct access to live financial markets
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Groww Hub
          </span>
        </div>

        {/* Product Navigation Cards List */}
        <div className="space-y-2.5">
          {products.map((item) => {
            const isSelected = activeTab === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group relative p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? "bg-slate-900 text-white border-slate-900 dark:bg-emerald-600 dark:border-emerald-600 shadow-md"
                    : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/70 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 hover:border-emerald-500/50 hover:shadow-xs"
                }`}
              >
                <div className="flex items-start space-x-3 pr-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${item.iconBg}`}>
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-bold text-xs ${isSelected ? "text-white" : "text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}`}>
                        {item.title}
                      </span>
                    </div>
                    <p className={`text-[11px] leading-snug mt-0.5 line-clamp-1 ${isSelected ? "text-slate-300 dark:text-emerald-100" : "text-slate-500 dark:text-slate-400"}`}>
                      {item.subtitle}
                    </p>

                    {/* Highlight Badge */}
                    <div className="mt-2">
                      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-md border ${isSelected ? "bg-white/20 text-white border-white/20" : item.badgeColor}`}>
                        {item.badge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-transform group-hover:translate-x-1 ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-600 group-hover:text-white"
                }`}>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mini Market Pulse Card */}
      <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-teal-950 rounded-3xl p-4 text-white shadow-sm border border-emerald-800/40">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-1.5">
            <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-extrabold text-xs tracking-tight">Market Intelligence</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
            Live 98.4%
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium">
          Nifty 50 RSI at 62.4 (Neutral Bullish). 12 Active IPOs with high GMP.
        </p>
        <button
          onClick={() => onSelectTab("advisor")}
          className="mt-3 w-full py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask AI Advisor Co-Pilot</span>
        </button>
      </div>

    </aside>
  );
};
