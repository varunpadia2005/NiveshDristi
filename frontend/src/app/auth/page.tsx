"use client";

import React, { useState } from "react";
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
  Layers
} from "lucide-react";
import { loginUser, signupUser, demoLogin } from "@/lib/api";
import { UserPersonaType, UserProfile } from "@/types";

export default function AuthPage() {
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [userType, setUserType] = useState<UserPersonaType>("RETAIL_INVESTOR");
  const [riskScore, setRiskScore] = useState<number>(6);
  const [broker, setBroker] = useState("Zerodha Kite");

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
      } else {
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
                Auth Portal
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">Algorithmic Co-Pilot & Multi-User Platform</div>
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
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex-1 space-y-12">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>SQLite Connected • Multi-User Persona Ecosystem</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Choose Your User Persona or Sign In
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Test NiveshDristi with pre-seeded one-click testing personas or create a custom account linked to your portfolio.
          </p>
        </div>

        {/* 1. ONE-CLICK DEMO PERSONAS TESTING SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-white flex items-center space-x-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Instant One-Click Testing Personas (No Password Required)</span>
            </h2>
            <span className="text-[10px] font-mono text-slate-400">Select any profile below for instant testing</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Persona 1: Retail Investor */}
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-black uppercase">
                    Retail Investor
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                    RS
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                    Rahul Sharma
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">rahul@niveshdristi.in</div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focuses on simplified portfolio tracking, long-term wealth building & Section 112A tax loss harvesting.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("RETAIL_INVESTOR")}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <span>One-Click Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Persona 2: Pro Trader */}
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase">
                    Pro Day & Swing Trader
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                    VM
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                    Vikram Mehta
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">vikram@niveshdristi.in</div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focuses on RSI/MACD breakouts, Options Call/Put Screener & 3Y Backtesting Sandbox.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("PRO_TRADER")}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
              >
                <span>One-Click Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Persona 3: Wealth Manager */}
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-black uppercase">
                    Wealth Manager
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                    PN
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                    Priya Nair
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">priya@niveshdristi.in</div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focuses on sector allocation drift, client rebalancing alerts, correlation matrix & Nifty -20% stress tests.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("WEALTH_MANAGER")}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-purple-600/20"
              >
                <span>One-Click Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Persona 4: Institutional Quant */}
            <div className="p-5 rounded-3xl bg-slate-800/80 border border-slate-700/80 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 shadow-lg group">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase">
                    Institutional Quant
                  </span>
                  <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-white">
                    AT
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-black text-white group-hover:text-emerald-400 transition-colors">
                    Dr. Aris Thorne
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono">aris@niveshdristi.in</div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Focuses on 10.4M data RAG vector training command center, embedding tuning & institutional stock reports.
                </p>
              </div>

              <button
                onClick={() => handleOneClickDemoLogin("INSTITUTIONAL_ANALYST")}
                disabled={loading}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer shadow-md shadow-amber-600/20"
              >
                <span>One-Click Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>

        {/* 2. CUSTOM LOGIN & SIGNUP FORM */}
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-800/90 border border-slate-700 shadow-2xl space-y-6">
          
          {/* Form Tabs */}
          <div className="p-1 rounded-2xl bg-slate-900 border border-slate-700 flex items-center">
            <button
              onClick={() => { setAuthMode("login"); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                authMode === "login"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In to Account
            </button>
            <button
              onClick={() => { setAuthMode("signup"); setErrorMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition cursor-pointer ${
                authMode === "signup"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Create New Account
            </button>
          </div>

          {/* Feedback Banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-bold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form */}
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
                  <label className="block text-slate-300 font-bold mb-1">Select Your User Persona Type</label>
                  <select
                    value={userType}
                    onChange={(e) => setUserType(e.target.value as UserPersonaType)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="RETAIL_INVESTOR">Retail Investor (Portfolio Tracking & Tax Harvesting)</option>
                    <option value="PRO_TRADER">Pro Day & Swing Trader (RSI/MACD & Options Screener)</option>
                    <option value="WEALTH_MANAGER">Wealth Manager (Client Drift & Stress Testing)</option>
                    <option value="INSTITUTIONAL_ANALYST">Institutional Quant Analyst (RAG Dataset Engine)</option>
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

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800 py-4 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} NiveshDristi Authentication Portal. All details stored in local SQLite DB.</p>
      </footer>

    </div>
  );
}
