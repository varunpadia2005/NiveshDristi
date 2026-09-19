"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  User, 
  TrendingUp, 
  Shield, 
  Cpu, 
  ArrowRight, 
  Lock, 
  Mail, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Sliders,
  Layers,
  Plus,
  Trash2,
  Search,
  Key,
  Database,
  Building,
  Check,
  ShieldAlert,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import { 
  loginUser, 
  signupUser, 
  demoLogin, 
  fetchAdminAuthTypes, 
  seedCustomPortfolio, 
  searchStocks 
} from "@/lib/api";
import { UserPersonaType, UserProfile, StockSearchResult } from "@/types";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup" | "admin">("login");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // User Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<UserPersonaType>("RETAIL_INVESTOR");
  const [riskScore, setRiskScore] = useState<number>(6);
  const [broker, setBroker] = useState("Zerodha Kite");

  // Admin Auth State
  const [adminAuthTypes, setAdminAuthTypes] = useState<any[]>([]);
  const [adminSecretKey, setAdminSecretKey] = useState("niveshdristi-admin-master-key-2026");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  // Custom Portfolio Builder State
  const [customPortfolioName, setCustomPortfolioName] = useState("My Custom Alpha Portfolio");
  const [customBrokerName, setCustomBrokerName] = useState("Zerodha Kite");
  const [customHoldings, setCustomHoldings] = useState<Array<{
    ticker: string;
    symbol_name: string;
    sector: string;
    quantity: number;
    average_buy_price: number;
  }>>([
    { ticker: "TATAMOTORS", symbol_name: "Tata Motors Ltd", sector: "Automobile", quantity: 50, average_buy_price: 945.50 },
    { ticker: "RELIANCE", symbol_name: "Reliance Industries Ltd", sector: "Energy", quantity: 20, average_buy_price: 2850.00 },
    { ticker: "TRENT", symbol_name: "Trent Ltd", sector: "Retail", quantity: 15, average_buy_price: 7120.00 }
  ]);

  // Stock Search state for builder
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
  const [inputQty, setInputQty] = useState<string>("10");
  const [inputPrice, setInputPrice] = useState<string>("");

  useEffect(() => {
    fetchAdminAuthData();
  }, []);

  const fetchAdminAuthData = async () => {
    try {
      const data = await fetchAdminAuthTypes();
      if (data && data.auth_methods) {
        setAdminAuthTypes(data.auth_methods);
      }
    } catch (err) {
      console.error("Failed to load admin auth details:", err);
    }
  };

  const handleStockSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim() || query.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const res = await searchStocks(query);
      setSearchResults(res || []);
    } catch (err) {
      console.error("Error searching stock:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectStock = (stock: StockSearchResult) => {
    setSelectedStock(stock);
    setInputPrice(stock.current_price.toString());
    setSearchQuery(stock.name);
    setSearchResults([]);
  };

  const handleAddHoldingItem = () => {
    if (!selectedStock) {
      setErrorMsg("Please search and select a stock first.");
      return;
    }
    const qty = parseFloat(inputQty);
    const price = parseFloat(inputPrice);

    if (isNaN(qty) || qty <= 0) {
      setErrorMsg("Please enter a valid positive quantity.");
      return;
    }
    if (isNaN(price) || price <= 0) {
      setErrorMsg("Please enter a valid buy price.");
      return;
    }

    setCustomHoldings([
      ...customHoldings,
      {
        ticker: selectedStock.ticker,
        symbol_name: selectedStock.name,
        sector: selectedStock.sector || "Equities",
        quantity: qty,
        average_buy_price: price
      }
    ]);

    // Reset inputs
    setSelectedStock(null);
    setSearchQuery("");
    setInputQty("10");
    setInputPrice("");
    setErrorMsg(null);
  };

  const handleRemoveHoldingItem = (index: number) => {
    setCustomHoldings(customHoldings.filter((_, i) => i !== index));
  };

  const saveUserSessionAndRedirect = (user: UserProfile, token: string, msg: string) => {
    localStorage.setItem("niveshdristi_user", JSON.stringify(user));
    localStorage.setItem("niveshdristi_token", token);
    setSuccessMsg(msg);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 600);
  };

  const handleOneClickDemoLogin = async (type: UserPersonaType) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await demoLogin(type);
      saveUserSessionAndRedirect(res.user, res.access_token, res.message);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to log in with demo persona.");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCustomPortfolio = async () => {
    if (customHoldings.length === 0) {
      setErrorMsg("Please add at least one stock holding to your custom portfolio.");
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    try {
      await seedCustomPortfolio({
        user_id: 1,
        portfolio_name: customPortfolioName,
        broker_name: customBrokerName,
        holdings: customHoldings
      });

      // Login as Admin / Custom User
      const res = await demoLogin("ADMIN");
      const updatedUser: UserProfile = {
        ...res.user,
        broker_connected: customPortfolioName
      };
      saveUserSessionAndRedirect(updatedUser, res.access_token, `Custom Portfolio '${customPortfolioName}' activated successfully! Opening Dashboard...`);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save custom portfolio.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      if (authMode === "login") {
        if (!email || !password) {
          setErrorMsg("Please enter both email and password.");
          setLoading(false);
          return;
        }
        const res = await loginUser({ email, password });
        saveUserSessionAndRedirect(res.user, res.access_token, res.message);
      } else if (authMode === "signup") {
        if (!fullName || !email || !password) {
          setErrorMsg("Please fill in all required fields.");
          setLoading(false);
          return;
        }
        const res = await signupUser({
          full_name: fullName,
          email,
          password,
          user_type: userType,
          risk_score: riskScore,
          broker_connected: broker
        });
        saveUserSessionAndRedirect(res.user, res.access_token, res.message);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalCustomInvestment = customHoldings.reduce((sum, h) => sum + (h.quantity * h.average_buy_price), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-white selection:bg-emerald-500 selection:text-slate-950 flex flex-col justify-between relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between relative z-10">
        <a href="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-lg font-black tracking-tight flex items-center space-x-1.5">
              <span>NiveshDristi</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
                Auth & Admin Console
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Algorithmic Engine & Persona Control</div>
          </div>
        </a>

        <a
          href="/dashboard"
          className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center space-x-1.5"
        >
          <span>Go to Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
        </a>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 flex-1 space-y-10">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SQLite Active • Admin Auth & Portfolio Seeding Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Authentication Portal & Admin Portfolio Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Access multi-persona sign-in, inspect all active authentication protocols, or build your own custom portfolio with live market sync.
          </p>
        </div>

        {/* 1. ONE-CLICK DEMO PERSONAS TESTING SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Multi-User Personas (One-Click Instant Access)</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Select any persona below to switch roles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Persona 1: Retail Investor */}
            <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[9px] font-black uppercase">
                    Retail Investor
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-white">
                    RS
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                    Rahul Sharma
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">rahul@niveshdristi.in</div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Portfolio tracking, tax loss harvesting & asset swaps.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("RETAIL_INVESTOR")}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] transition flex items-center justify-center space-x-1 cursor-pointer shadow-md"
              >
                <span>Login as Retail</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Persona 2: Pro Trader */}
            <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-black uppercase">
                    Pro Trader
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-white">
                    VM
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                    Vikram Mehta
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">vikram@niveshdristi.in</div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  RSI/MACD breakouts & 3Y Backtesting sandbox.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("PRO_TRADER")}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] transition flex items-center justify-center space-x-1 cursor-pointer shadow-md"
              >
                <span>Login as Pro</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Persona 3: Wealth Manager */}
            <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[9px] font-black uppercase">
                    Wealth Manager
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-white">
                    PN
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                    Priya Nair
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">priya@niveshdristi.in</div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Sector drift alerts, correlation & stress testing.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("WEALTH_MANAGER")}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] transition flex items-center justify-center space-x-1 cursor-pointer shadow-md"
              >
                <span>Login as Wealth</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Persona 4: Institutional Quant */}
            <div className="p-4 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[9px] font-black uppercase">
                    Institutional Quant
                  </span>
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center font-bold text-[11px] text-white">
                    AT
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-emerald-400 transition-colors">
                    Dr. Aris Thorne
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">aris@niveshdristi.in</div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  10.4M data RAG vector training & report engine.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("INSTITUTIONAL_ANALYST")}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[11px] transition flex items-center justify-center space-x-1 cursor-pointer shadow-md"
              >
                <span>Login as Quant</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Persona 5: Admin Auth */}
            <div className="p-4 rounded-3xl bg-slate-800/80 border border-red-500/40 hover:border-red-500 transition-all flex flex-col justify-between space-y-3 shadow-lg shadow-red-500/5 group">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/30 text-[9px] font-black uppercase">
                    System Admin
                  </span>
                  <div className="w-7 h-7 rounded-full bg-red-900/60 border border-red-500/40 flex items-center justify-center font-bold text-[11px] text-red-300">
                    AD
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-black text-white group-hover:text-red-400 transition-colors">
                    Super Administrator
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">admin@niveshdristi.in</div>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Auth Inspection, Auth Protocols & Custom Portfolio Creator.
                </p>
              </div>

              <button
                onClick={() => {
                  setAuthMode("admin");
                  handleOneClickDemoLogin("ADMIN");
                }}
                disabled={loading}
                className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-[11px] transition flex items-center justify-center space-x-1 cursor-pointer shadow-md shadow-red-600/20"
              >
                <span>Admin Auth Login</span>
                <ShieldCheck className="w-3 h-3" />
              </button>
            </div>

          </div>
        </div>

        {/* NAVIGATION TABS FOR AUTH & ADMIN */}
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <div className="p-1.5 rounded-2xl bg-slate-800 border border-slate-700 flex items-center space-x-2">
            <button
              onClick={() => { setAuthMode("login"); setErrorMsg(null); }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                authMode === "login"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>User Sign In</span>
            </button>
            <button
              onClick={() => { setAuthMode("signup"); setErrorMsg(null); }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                authMode === "signup"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Register Account</span>
            </button>
            <button
              onClick={() => { setAuthMode("admin"); setErrorMsg(null); }}
              className={`px-5 py-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center space-x-2 ${
                authMode === "admin"
                  ? "bg-red-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Key className="w-3.5 h-3.5" />
              <span>Admin Auth & Custom Portfolio</span>
            </button>
          </div>
        </div>

        {/* FEEDBACK BANNERS */}
        {errorMsg && (
          <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* TAB 1 & 2: USER LOGIN / SIGNUP FORM */}
        {(authMode === "login" || authMode === "signup") && (
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-2xl space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-black text-white">
                {authMode === "login" ? "Sign In to Your NiveshDristi Account" : "Create New Persona Profile"}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === "login" ? "Enter your registered credentials below" : "Set up your risk profile & broker integration"}
              </p>
            </div>

            <form onSubmit={handleSubmitAuth} className="space-y-4 text-xs">
              
              {authMode === "signup" && (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Varun Padia"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. user@niveshdristi.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {authMode === "signup" && (
                <>
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Select User Persona Type</label>
                    <select
                      value={userType}
                      onChange={(e) => setUserType(e.target.value as UserPersonaType)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="RETAIL_INVESTOR">Retail Investor (Portfolio Tracking & Tax Harvesting)</option>
                      <option value="PRO_TRADER">Pro Day & Swing Trader (RSI/MACD & Options Screener)</option>
                      <option value="WEALTH_MANAGER">Wealth Manager (Client Drift & Stress Testing)</option>
                      <option value="INSTITUTIONAL_ANALYST">Institutional Quant Analyst (RAG Dataset Engine)</option>
                      <option value="ADMIN">System Administrator (Full Management)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Broker Integration</label>
                      <select
                        value={broker}
                        onChange={(e) => setBroker(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Zerodha Kite">Zerodha Kite</option>
                        <option value="Upstox Pro">Upstox Pro</option>
                        <option value="Groww">Groww</option>
                        <option value="ICICI Direct">ICICI Direct</option>
                        <option value="Angel One">Angel One</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Risk Appetite: <span className="text-emerald-400 font-mono">{riskScore}/10</span></label>
                      <input
                        type="range"
                        min={1}
                        max={10}
                        value={riskScore}
                        onChange={(e) => setRiskScore(Number(e.target.value))}
                        className="w-full accent-emerald-500 mt-2"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-xs transition shadow-lg shadow-emerald-600/30 cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>{loading ? "Authenticating..." : authMode === "login" ? "Sign In to Dashboard" : "Register & Open Dashboard"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ADMIN AUTH & PORTFOLIO BUILDER */}
        {authMode === "admin" && (
          <div className="space-y-8">
            
            {/* 3A. ALL AUTHENTICATION TYPES INSPECTOR */}
            <div className="p-6 rounded-3xl bg-slate-800/90 border border-slate-700 space-y-6 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-red-400 text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    <span>Admin Centralized Authentication Inspector</span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    System Authentication Protocols & Active Broker Gateways
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live overview of all OAuth 2.0 broker sessions, JWT user tokens, and security credentials across NiveshDristi.
                  </p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-mono text-xs font-bold flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
                  <span>SUPERUSER ACTIVE</span>
                </div>
              </div>

              {/* Grid of Auth Types */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {adminAuthTypes.map((auth, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 space-y-3 hover:border-red-500/50 transition">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono font-bold">
                        {auth.protocol}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        {auth.status}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{auth.name}</h4>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Active Sessions: <span className="text-emerald-400 font-bold">{auth.active_sessions.toLocaleString()}</span> • Expiry: {auth.token_expiry}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-bold mb-1">Granted Scope & Permissions:</div>
                      <div className="flex flex-wrap gap-1">
                        {auth.permissions.map((perm: string, pIdx: number) => (
                          <span key={pIdx} className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[9px]">
                            ✓ {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3B. ADD MY OWN PORTFOLIO CONSOLE */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-800/90 border border-emerald-500/40 space-y-6 shadow-2xl">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <Building className="w-4 h-4 text-emerald-400" />
                    <span>Admin Custom Portfolio Engine</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    Add & Customize Your Own Investment Portfolio
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manually build a personalized portfolio with exact holdings, buy prices, and quantities across all 8,641+ NSE/BSE stocks.
                  </p>
                </div>

                <button
                  onClick={handleSaveCustomPortfolio}
                  disabled={loading || customHoldings.length === 0}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-xs transition shadow-lg shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Save & Activate Portfolio</span>
                </button>
              </div>

              {/* Portfolio Config Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-700">
                <div>
                  <label className="block text-slate-300 font-bold text-xs mb-1">Portfolio Display Name *</label>
                  <input
                    type="text"
                    value={customPortfolioName}
                    onChange={(e) => setCustomPortfolioName(e.target.value)}
                    placeholder="e.g. Varun's High Beta Growth Portfolio"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold text-xs mb-1">Broker Gateway / Connection *</label>
                  <input
                    type="text"
                    value={customBrokerName}
                    onChange={(e) => setCustomBrokerName(e.target.value)}
                    placeholder="e.g. Zerodha Kite API / Groww Sync"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Add New Stock Builder */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-700 space-y-4">
                <h4 className="text-sm font-black text-white flex items-center space-x-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Search & Add Stock Holding (8,641+ NSE & BSE Universe)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
                  
                  {/* Stock Autocomplete Search */}
                  <div className="md:col-span-2 relative">
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">Search Ticker or Company</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleStockSearch(e.target.value)}
                        placeholder="Search stock e.g. TATA, HINDUSTAN, BMW, TRENT..."
                        className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 font-bold"
                      />
                    </div>

                    {/* Autocomplete Dropdown */}
                    {searchResults.length > 0 && (
                      <div className="absolute left-0 right-0 top-16 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-h-60 overflow-y-auto z-50 divide-y divide-slate-700/50">
                        {searchResults.map((stock, i) => (
                          <div
                            key={i}
                            onClick={() => handleSelectStock(stock)}
                            className="p-3 hover:bg-slate-700/80 transition cursor-pointer flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-black text-white flex items-center space-x-2">
                                <span>{stock.ticker}</span>
                                {stock.bse_only && (
                                  <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-bold">BSE</span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">{stock.name} • {stock.sector || "Equities"}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-mono font-bold text-emerald-400">₹{stock.current_price.toFixed(2)}</div>
                              <div className="text-[9px] text-slate-400">Live Spot</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">Quantity (Shares)</label>
                    <input
                      type="number"
                      value={inputQty}
                      onChange={(e) => setInputQty(e.target.value)}
                      placeholder="10"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Average Buy Price */}
                  <div>
                    <label className="block text-[11px] text-slate-400 font-bold mb-1">Average Buy Price (₹)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={inputPrice}
                      onChange={(e) => setInputPrice(e.target.value)}
                      placeholder="950.00"
                      className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                </div>

                <div className="flex items-center justify-between pt-2">
                  {selectedStock ? (
                    <div className="text-xs text-emerald-400 font-bold flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Selected: {selectedStock.name} ({selectedStock.ticker}) at ₹{selectedStock.current_price.toFixed(2)}</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">Search any stock above to select it</div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddHoldingItem}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs transition flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Add Holding</span>
                  </button>
                </div>
              </div>

              {/* Holdings Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white">
                    Custom Portfolio Holdings ({customHoldings.length} Positions)
                  </h4>
                  <div className="text-xs font-mono font-bold text-slate-400">
                    Total Investment: <span className="text-emerald-400">₹{totalCustomInvestment.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {customHoldings.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-slate-900 border border-slate-700 text-center text-slate-400 text-xs">
                    No holdings added yet. Use the stock search above to build your custom portfolio.
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-700">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900/90 text-slate-400 border-b border-slate-700 font-bold text-[11px]">
                          <th className="p-3">Ticker / Symbol</th>
                          <th className="p-3">Sector</th>
                          <th className="p-3 text-right">Quantity</th>
                          <th className="p-3 text-right">Avg Buy Price (₹)</th>
                          <th className="p-3 text-right">Total Investment (₹)</th>
                          <th className="p-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/40">
                        {customHoldings.map((h, i) => {
                          const cost = h.quantity * h.average_buy_price;
                          return (
                            <tr key={i} className="hover:bg-slate-800/60 transition">
                              <td className="p-3 font-extrabold text-white">
                                {h.ticker}
                                <div className="text-[10px] text-slate-400 font-normal">{h.symbol_name}</div>
                              </td>
                              <td className="p-3 text-slate-300 font-medium">{h.sector}</td>
                              <td className="p-3 text-right font-mono font-bold text-white">{h.quantity}</td>
                              <td className="p-3 text-right font-mono text-slate-300">₹{h.average_buy_price.toFixed(2)}</td>
                              <td className="p-3 text-right font-mono font-bold text-emerald-400">₹{cost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => handleRemoveHoldingItem(i)}
                                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                                  title="Remove position"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-4 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} NiveshDristi Administrative Authentication & Portfolio Engine. Local SQLite Database Linked.</p>
      </footer>

    </div>
  );
}
