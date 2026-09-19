"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart2, 
  Activity, 
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Plus,
  Building2,
  RefreshCw,
  Filter
} from "lucide-react";
import { searchStocks, fetchTopMovers, fetchSectorMovements, fetchAllListedStocks } from "@/lib/api";
import { StockSearchResult, TopMoversResponse, SectorMovement } from "@/types";

interface MarketScreenerProps {
  onOpenStockDetail?: (ticker: string) => void;
  onOpenTechnicalDrawer: (ticker: string) => void;
  onOpenAiReport?: (ticker: string) => void;
  onOpenAddModalWithTicker?: (ticker: string, name: string, sector: string, price: number) => void;
}

export const MarketScreener: React.FC<MarketScreenerProps> = ({
  onOpenStockDetail,
  onOpenTechnicalDrawer,
  onOpenAiReport,
  onOpenAddModalWithTicker,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownResults, setDropdownResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Master Catalog State (8,641+ Stocks)
  const [catalogStocks, setCatalogStocks] = useState<StockSearchResult[]>([]);
  const [totalCatalogCount, setTotalCatalogCount] = useState<number>(8641);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 50;

  const [topMovers, setTopMovers] = useState<TopMoversResponse | null>(null);
  const [sectors, setSectors] = useState<SectorMovement[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter Tabs
  const [selectedCap, setSelectedCap] = useState<"ALL" | "largecap" | "midcap" | "smallcap">("ALL");
  const [selectedSector, setSelectedSector] = useState<string>("ALL");
  const [moverType, setMoverType] = useState<"gainers" | "losers">("gainers");
  const [exchangeFilter, setExchangeFilter] = useState<"ALL" | "DUAL" | "BSE">("ALL");
  const [selectedExchanges, setSelectedExchanges] = useState<Record<string, "NSE" | "BSE">>({});

  useEffect(() => {
    loadMarketData();
  }, [currentPage, selectedCap, selectedSector, exchangeFilter]);

  const loadMarketData = async () => {
    setLoading(true);
    try {
      const [moversData, sectorsData, catalogData] = await Promise.all([
        fetchTopMovers(),
        fetchSectorMovements(),
        fetchAllListedStocks({
          exchange: exchangeFilter,
          capType: selectedCap,
          sector: selectedSector === "ALL" ? undefined : selectedSector,
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        })
      ]);
      setTopMovers(moversData);
      setSectors(sectorsData);
      setCatalogStocks(catalogData.stocks);
      setTotalCatalogCount(catalogData.total_count || 8641);
    } catch (err) {
      console.error("Error loading screener data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (!val.trim()) {
      setDropdownResults([]);
      setShowDropdown(false);
      return;
    }
    setIsSearching(true);
    setShowDropdown(true);
    try {
      const res = await searchStocks(val);
      setDropdownResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const totalPages = Math.ceil(totalCatalogCount / pageSize);

  return (
    <div className="space-y-6">
      
      {/* 1. Groww-Like Real-Time Search Bar */}
      <div className="light-card rounded-2xl p-6 bg-gradient-to-r from-emerald-50/50 via-white to-indigo-50/50 border border-slate-200 relative">
        <div className="max-w-3xl mx-auto space-y-3 text-center">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Institutional-Grade Market Screener</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Discover {totalCatalogCount.toLocaleString("en-IN")}+ Listed Stocks Across NSE & BSE
          </h2>
          <p className="text-xs text-slate-600 font-medium max-w-xl mx-auto">
            Live prices, Level-2 depth streams, dual exchange switching (NSE / BSE), corporate events calendar, and real-time market news.
          </p>

          {/* Search Input Box with Real-Time Auto-Complete Dropdown */}
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim() && setShowDropdown(true)}
              placeholder="Search all 8,641+ stocks by company name, NSE symbol, or BSE code (e.g. Tata Motors, 500570, Suzlon, Trent, Dyeing)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 font-medium text-sm outline-none shadow-sm transition-all"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            {/* Auto-Complete Floating Dropdown */}
            {showDropdown && dropdownResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden text-left divide-y divide-slate-100 max-h-96 overflow-y-auto z-50 animate-in fade-in duration-100">
                {dropdownResults.map((stock) => {
                  const activeEx = selectedExchanges[stock.ticker] || stock.exchange || "NSE";
                  const displayPrice = activeEx === "BSE" && stock.bse_price ? stock.bse_price : stock.current_price;
                  const isPositive = stock.day_change_pct >= 0;

                  return (
                    <div
                      key={stock.ticker}
                      className="p-3.5 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
                      onClick={() => {
                        setShowDropdown(false);
                        if (onOpenStockDetail) onOpenStockDetail(stock.ticker);
                        else onOpenTechnicalDrawer(stock.ticker);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isPositive ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                          {stock.ticker.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-sm">{stock.name}</span>
                            {stock.bse_only ? (
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-purple-100 text-purple-900">
                                BSE Exclusive
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                                {stock.cap_type}
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 flex items-center space-x-2">
                            <span className="font-bold text-slate-700">{stock.ticker}</span>
                            {stock.bse_code && <span className="font-mono text-slate-400">BSE: {stock.bse_code}</span>}
                            <span>•</span>
                            <span>{stock.sector}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right flex items-center space-x-3">
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm font-mono">
                            ₹{displayPrice.toLocaleString("en-IN")}
                          </div>
                          <div className={`text-xs font-bold ${isPositive ? "text-emerald-600" : "text-rose-600"}`}>
                            {isPositive ? "+" : ""}{stock.day_change_pct}%
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDropdown(false);
                            if (onOpenStockDetail) onOpenStockDetail(stock.ticker);
                            else onOpenTechnicalDrawer(stock.ticker);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition"
                        >
                          View Graph
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Screener Controls & Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3">
            
            {/* Exchange Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
              {[
                { id: "ALL", label: `All Listed (${totalCatalogCount})` },
                { id: "DUAL", label: "NSE & BSE Dual" },
                { id: "BSE", label: "BSE Exclusives" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setExchangeFilter(tab.id as any);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    exchangeFilter === tab.id
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Market Cap & Sector Filters */}
            <div className="flex items-center space-x-2 text-xs font-bold">
              <select
                value={selectedCap}
                onChange={(e) => {
                  setSelectedCap(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Market Caps</option>
                <option value="largecap">Large Cap</option>
                <option value="midcap">Mid Cap</option>
                <option value="smallcap">Small Cap</option>
              </select>

              <select
                value={selectedSector}
                onChange={(e) => {
                  setSelectedSector(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 text-slate-800 font-bold px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ALL">All Sectors</option>
                <option value="Banking">Banking & Financials</option>
                <option value="IT Services">IT & Software</option>
                <option value="Energy">Energy & Oil/Gas</option>
                <option value="Automobile">Automobile & Auto Components</option>
                <option value="Pharmaceuticals">Pharma & Healthcare</option>
                <option value="FMCG">FMCG & Consumer Goods</option>
                <option value="Realty">Realty & Construction</option>
                <option value="Metals">Metals & Mining</option>
              </select>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Full Master Screener Catalog Grid (Paginated 8,641+ Stocks) */}
      <div className="light-card rounded-2xl p-6 border border-slate-200 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <span>Full Stock Universe Screener</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Browsing Page {currentPage} of {totalPages} ({pageSize} stocks per page)
            </p>
          </div>

          {/* Pagination Navigation */}
          <div className="flex items-center space-x-2 text-xs font-bold">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 rounded-xl bg-slate-100 font-mono text-slate-800">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stock Catalog Cards */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-slate-500">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold">Fetching page {currentPage} from 8,641+ listed stock universe...</span>
          </div>
        ) : catalogStocks.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <p className="font-bold text-sm">No stocks matched the selected filters.</p>
            <button
              onClick={() => {
                setSelectedCap("ALL");
                setSelectedSector("ALL");
                setExchangeFilter("ALL");
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {catalogStocks.map((stock) => {
              const activeEx = selectedExchanges[stock.ticker] || stock.exchange || "NSE";
              const displayPrice = activeEx === "BSE" && stock.bse_price ? stock.bse_price : stock.current_price;
              const isPositive = stock.day_change_pct >= 0;

              return (
                <div
                  key={stock.ticker}
                  onClick={() => {
                    if (onOpenStockDetail) onOpenStockDetail(stock.ticker);
                    else onOpenTechnicalDrawer(stock.ticker);
                  }}
                  className="light-card light-card-hover rounded-xl p-4 border border-slate-200/80 bg-white flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        {stock.ticker.replace(".NS", "").replace(".BO", "")}
                      </span>
                      {stock.bse_only ? (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-900">
                          BSE
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                          {stock.cap_type}
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {stock.name}
                    </h4>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center justify-between">
                      <span>{stock.sector}</span>
                      {stock.bse_code && <span className="font-mono">#{stock.bse_code}</span>}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Price ({activeEx})</div>
                      <div className="font-extrabold text-slate-900 text-sm font-mono">
                        ₹{displayPrice.toLocaleString("en-IN")}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <div className={`text-xs font-bold px-2 py-0.5 rounded-md flex items-center ${
                        isPositive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                      }`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> : <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />}
                        <span>{isPositive ? "+" : ""}{stock.day_change_pct}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
