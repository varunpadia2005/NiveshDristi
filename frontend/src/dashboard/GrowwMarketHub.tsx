"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Rocket, 
  Landmark, 
  Layers, 
  Zap, 
  Search, 
  ArrowRight,
  Flame,
  ShieldCheck,
  Percent,
  Sparkles,
  Award
} from "lucide-react";
import { MarketScreener } from "@/components/MarketScreener";
import { IpoSection } from "@/components/IpoSection";
import { BondsSection } from "@/components/BondsSection";
import { EtfsSection } from "@/components/EtfsSection";

interface GrowwMarketHubProps {
  onOpenStockDetail: (ticker: string) => void;
  onOpenTechnicalDrawer: (ticker: string) => void;
  onOpenAiReport: (ticker: string) => void;
  onOpenAddModalWithTicker?: (ticker: string, name: string, sector: string, price: number) => void;
}

export const GrowwMarketHub: React.FC<GrowwMarketHubProps> = ({
  onOpenStockDetail,
  onOpenTechnicalDrawer,
  onOpenAiReport,
  onOpenAddModalWithTicker
}) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "stocks" | "ipos" | "bonds" | "etfs">("all");

  return (
    <div className="space-y-8">
      
      {/* Groww Style Category Navigation Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-emerald-500 fill-emerald-500" />
              <span>Explore Products & Financial Markets</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Synced with Indian Market Exchanges (NSE / BSE), RBI Sovereign Bonds & Live IPO GMP
            </p>
          </div>

          <div className="flex items-center space-x-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
            {[
              { id: "all", label: "All Products" },
              { id: "stocks", label: "Stocks" },
              { id: "ipos", label: "IPOs" },
              { id: "bonds", label: "Bonds & SGB" },
              { id: "etfs", label: "ETFs" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id as any)}
                className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Category Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          
          <div 
            onClick={() => setActiveCategory("stocks")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              activeCategory === "stocks"
                ? "bg-emerald-50/50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-800"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:border-emerald-500"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Equities & Stocks</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Large, Mid & Small Cap</div>
          </div>

          <div 
            onClick={() => setActiveCategory("ipos")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              activeCategory === "ipos"
                ? "bg-purple-50/50 border-purple-300 dark:bg-purple-950/20 dark:border-purple-800"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:border-purple-500"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Rocket className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">IPOs & New Issues</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Live Grey Market Premium</div>
          </div>

          <div 
            onClick={() => setActiveCategory("bonds")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              activeCategory === "bonds"
                ? "bg-amber-50/50 border-amber-300 dark:bg-amber-950/20 dark:border-amber-800"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:border-amber-500"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Landmark className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">Bonds & SGBs</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Fixed Returns & RBI Sovereign</div>
          </div>

          <div 
            onClick={() => setActiveCategory("etfs")}
            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
              activeCategory === "etfs"
                ? "bg-blue-50/50 border-blue-300 dark:bg-blue-950/20 dark:border-blue-800"
                : "bg-slate-50 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500"
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900 dark:text-white">ETFs & Index Funds</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Passive Index & Gold BeES</div>
          </div>

        </div>
      </div>

      {/* 1. STOCKS & MARKET SCREENER SECTION */}
      {(activeCategory === "all" || activeCategory === "stocks") && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Trending Stocks & Screener Universe
            </h3>
          </div>
          <MarketScreener
            onOpenStockDetail={onOpenStockDetail}
            onOpenTechnicalDrawer={onOpenTechnicalDrawer}
            onOpenAiReport={onOpenAiReport}
            onOpenAddModalWithTicker={onOpenAddModalWithTicker}
          />
        </div>
      )}

      {/* 2. IPOs HUB SECTION */}
      {(activeCategory === "all" || activeCategory === "ipos") && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <Rocket className="w-5 h-5 text-purple-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Initial Public Offerings (IPOs) & GMP Tracker
            </h3>
          </div>
          <IpoSection />
        </div>
      )}

      {/* 3. BONDS & SGB HUB SECTION */}
      {(activeCategory === "all" || activeCategory === "bonds") && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <Landmark className="w-5 h-5 text-amber-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Fixed Income Bonds & Sovereign Gold Bonds (SGB)
            </h3>
          </div>
          <BondsSection />
        </div>
      )}

      {/* 4. ETFs & INDEX FUNDS SECTION */}
      {(activeCategory === "all" || activeCategory === "etfs") && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Exchange Traded Funds (ETFs) & Index Hub
            </h3>
          </div>
          <EtfsSection
            onOpenTechnicalDrawer={onOpenTechnicalDrawer}
            onOpenStockDetail={onOpenStockDetail}
          />
        </div>
      )}

    </div>
  );
};
