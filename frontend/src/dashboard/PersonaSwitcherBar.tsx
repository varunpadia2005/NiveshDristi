"use client";

import React from "react";
import { UserProfile, UserPersonaType } from "@/types";
import { LogOut, UserCheck } from "lucide-react";

interface PersonaSwitcherBarProps {
  currentUser: UserProfile | null;
  onSwitchPersona: (type: UserPersonaType) => void;
  onLogout: () => void;
}

export const PersonaSwitcherBar: React.FC<PersonaSwitcherBarProps> = ({
  currentUser,
  onSwitchPersona,
  onLogout
}) => {
  const getPersonaBadgeStyle = (type?: UserPersonaType) => {
    switch (type) {
      case "PRO_TRADER":
        return { label: "PRO DAY TRADER", bg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" };
      case "WEALTH_MANAGER":
        return { label: "WEALTH MANAGER", bg: "bg-purple-500/10 text-purple-600 border-purple-500/20" };
      case "INSTITUTIONAL_ANALYST":
        return { label: "INSTITUTIONAL QUANT", bg: "bg-amber-500/10 text-amber-600 border-amber-500/20" };
      default:
        return { label: "RETAIL INVESTOR", bg: "bg-blue-500/10 text-blue-600 border-blue-500/20" };
    }
  };

  const personaBadge = getPersonaBadgeStyle(currentUser?.user_type);

  return (
    <div className="bg-slate-900 text-white px-4 sm:px-6 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs gap-2">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-extrabold text-slate-200">Active Persona:</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-black text-white">{currentUser?.full_name || "Rahul Sharma"}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${personaBadge.bg}`}>
            {personaBadge.label}
          </span>
        </div>
      </div>

      {/* Persona Switcher Dropdown & Logout */}
      <div className="flex items-center space-x-3">
        <select
          onChange={(e) => onSwitchPersona(e.target.value as UserPersonaType)}
          value={currentUser?.user_type || "RETAIL_INVESTOR"}
          className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="RETAIL_INVESTOR">👤 Switch to Rahul (Retail Investor)</option>
          <option value="PRO_TRADER">📈 Switch to Vikram (Pro Trader)</option>
          <option value="WEALTH_MANAGER">🛡️ Switch to Priya (Wealth Manager)</option>
          <option value="INSTITUTIONAL_ANALYST">🔬 Switch to Aris (Institutional Quant)</option>
        </select>

        <a
          href="/auth"
          className="text-slate-400 hover:text-white flex items-center space-x-1 text-[11px] font-bold px-2 py-1 rounded-md hover:bg-slate-800 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Auth Portal</span>
        </a>
      </div>
    </div>
  );
};
