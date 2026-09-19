"use client";

import React, { useState, useEffect } from "react";
import { 
  Code2, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  Activity, 
  Layers, 
  Database, 
  Zap, 
  ShieldCheck, 
  Globe, 
  BookOpen, 
  Search,
  ExternalLink,
  ChevronRight
} from "lucide-react";

interface ApiEndpointDef {
  id: string;
  method: "GET" | "POST";
  path: string;
  title: string;
  description: string;
  category: "Catalog" | "Quotes & Depth" | "Charts" | "Technical Analysis";
  sampleParams: string;
  curlSnippet: string;
  jsSnippet: string;
  pythonSnippet: string;
}

const ENDPOINTS: ApiEndpointDef[] = [
  {
    id: "stocks-all",
    method: "GET",
    path: "/api/personal-api/stocks/all",
    title: "All Listed Stocks Master Catalog",
    description: "Returns full universe of all listed stocks on NSE & BSE with live market prices, BSE codes, exchange listings, market cap, and PE ratios.",
    category: "Catalog",
    sampleParams: "?exchange=ALL&cap_type=largecap&limit=10",
    curlSnippet: `curl -X GET "http://localhost:8000/api/personal-api/stocks/all?exchange=ALL&limit=10" \\
  -H "Accept: application/json"`,
    jsSnippet: `const response = await fetch("http://localhost:8000/api/personal-api/stocks/all?exchange=ALL&limit=10");
const data = await response.json();
console.log("Total Listed Stocks:", data.total_count, data.stocks);`,
    pythonSnippet: `import requests

response = requests.get("http://localhost:8000/api/personal-api/stocks/all?exchange=ALL&limit=10")
data = response.json()
print(f"Total Stocks: {data['total_count']}")
for stock in data['stocks']:
    print(f"{stock['name']} ({stock['ticker']}) - ₹{stock['current_price']}")`
  },
  {
    id: "stock-quote",
    method: "GET",
    path: "/api/personal-api/stocks/quote/{symbol}",
    title: "Real-Time Stock Quote Engine",
    description: "Returns real-time market quote including LTP, day change, volume, OHLC prices, 52-week high/low, and dual-exchange pricing (NSE & BSE).",
    category: "Quotes & Depth",
    sampleParams: "RELIANCE.NS",
    curlSnippet: `curl -X GET "http://localhost:8000/api/personal-api/stocks/quote/RELIANCE.NS" \\
  -H "Accept: application/json"`,
    jsSnippet: `const response = await fetch("http://localhost:8000/api/personal-api/stocks/quote/RELIANCE.NS");
const quote = await response.json();
console.log("LTP:", quote.current_price, "Change:", quote.day_change_pct + "%");`,
    pythonSnippet: `import requests

quote = requests.get("http://localhost:8000/api/personal-api/stocks/quote/RELIANCE.NS").json()
print(f"Ticker: {quote['ticker']}, Price: ₹{quote['current_price']}, Day Change: {quote['day_change_pct']}%")`
  },
  {
    id: "stock-orderbook",
    method: "GET",
    path: "/api/personal-api/stocks/orderbook/{symbol}",
    title: "Level-2 Bid/Ask Order Book Depth",
    description: "Returns real-time Level-2 Market Depth: Top 5 Bids & Asks, quantities, order counts, total buy/sell volume, spread points, and buy/sell ratio.",
    category: "Quotes & Depth",
    sampleParams: "TCS.NS",
    curlSnippet: `curl -X GET "http://localhost:8000/api/personal-api/stocks/orderbook/TCS.NS" \\
  -H "Accept: application/json"`,
    jsSnippet: `const response = await fetch("http://localhost:8000/api/personal-api/stocks/orderbook/TCS.NS");
const orderBook = await response.json();
console.log("Top Bid:", orderBook.bids[0], "Top Ask:", orderBook.asks[0]);`,
    pythonSnippet: `import requests

ob = requests.get("http://localhost:8000/api/personal-api/stocks/orderbook/TCS.NS").json()
print(f"Total Buy Qty: {ob['total_buy_quantity']} | Total Sell Qty: {ob['total_sell_quantity']}")`
  },
  {
    id: "stock-chart",
    method: "GET",
    path: "/api/personal-api/stocks/chart/{symbol}",
    title: "Multi-Timeframe OHLCV Graph Data",
    description: "Returns authentic candle chart points across 1D (5-min), 1W, 1M, 1Y, and 5Y timeframes with SMA-20, SMA-50, and EMA-9 overlay metrics.",
    category: "Charts",
    sampleParams: "HDFCBANK.NS?timeframe=1D",
    curlSnippet: `curl -X GET "http://localhost:8000/api/personal-api/stocks/chart/HDFCBANK.NS?timeframe=1D" \\
  -H "Accept: application/json"`,
    jsSnippet: `const response = await fetch("http://localhost:8000/api/personal-api/stocks/chart/HDFCBANK.NS?timeframe=1D");
const chartData = await response.json();
console.log("Total Candles:", chartData.candles.length);`,
    pythonSnippet: `import requests

chart = requests.get("http://localhost:8000/api/personal-api/stocks/chart/HDFCBANK.NS?timeframe=1D").json()
print(f"Candles Count: {len(chart['candles'])}")`
  },
  {
    id: "stock-technical",
    method: "GET",
    path: "/api/personal-api/stocks/technical/{symbol}",
    title: "Technical Indicators & AI Verdict",
    description: "Returns RSI-14, MACD line/histogram, Bollinger Bands, Moving Average trend alignment, Support/Resistance levels, and AI composite signal.",
    category: "Technical Analysis",
    sampleParams: "INFY.NS",
    curlSnippet: `curl -X GET "http://localhost:8000/api/personal-api/stocks/technical/INFY.NS" \\
  -H "Accept: application/json"`,
    jsSnippet: `const response = await fetch("http://localhost:8000/api/personal-api/stocks/technical/INFY.NS");
const tech = await response.json();
console.log("AI Verdict:", tech.ai_composite_signal, "RSI:", tech.indicators.rsi_14);`,
    pythonSnippet: `import requests

tech = requests.get("http://localhost:8000/api/personal-api/stocks/technical/INFY.NS").json()
print(f"AI Verdict: {tech['ai_composite_signal']} | RSI: {tech['indicators']['rsi_14']}")`
  },
  {
    id: "api-summary",
    method: "GET",
    path: "/api/personal-api/stocks/summary",
    title: "API Universe & Health Summary",
    description: "Returns operational health status, total NSE & BSE listed counts, sector breakdown count, and active endpoint manifest.",
    category: "Catalog",
    sampleParams: "",
    curlSnippet: `curl -X GET "http://localhost:8000/api/personal-api/stocks/summary" \\
  -H "Accept: application/json"`,
    jsSnippet: `const response = await fetch("http://localhost:8000/api/personal-api/stocks/summary");
const summary = await response.json();
console.log("Personal Stock API Status:", summary.status);`,
    pythonSnippet: `import requests

summary = requests.get("http://localhost:8000/api/personal-api/stocks/summary").json()
print(f"API Status: {summary['status']} | Total Stocks: {summary['total_universe_stocks']}")`
  }
];

export default function PersonalApiDocsView() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointDef>(ENDPOINTS[0]);
  const [activeCodeLang, setActiveCodeLang] = useState<"curl" | "javascript" | "python">("curl");
  const [paramInput, setParamInput] = useState<string>(ENDPOINTS[0].sampleParams);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);
  const [summaryData, setSummaryData] = useState<any>(null);

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/personal-api/stocks/summary");
      if (res.ok) {
        const data = await res.json();
        setSummaryData(data);
      }
    } catch (e) {
      console.log("Offline summary fallback");
    }
  };

  const handleSelectEndpoint = (ep: ApiEndpointDef) => {
    setSelectedEndpoint(ep);
    setParamInput(ep.sampleParams);
    setApiResponse(null);
  };

  const handleExecuteRequest = async () => {
    setIsLoading(true);
    setApiResponse(null);
    try {
      let targetUrl = "";
      if (selectedEndpoint.path.includes("{symbol}")) {
        const cleanSymbol = paramInput.trim() || "RELIANCE.NS";
        targetUrl = `http://localhost:8000${selectedEndpoint.path.replace("{symbol}", cleanSymbol)}`;
      } else {
        const cleanParams = paramInput.startsWith("?") ? paramInput : (paramInput ? `?${paramInput}` : "");
        targetUrl = `http://localhost:8000${selectedEndpoint.path}${cleanParams}`;
      }

      const res = await fetch(targetUrl);
      const data = await res.json();
      setApiResponse(JSON.stringify(data, null, 2));
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: "API execution error", details: err.message }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const getCodeSnippet = () => {
    if (activeCodeLang === "javascript") return selectedEndpoint.jsSnippet;
    if (activeCodeLang === "python") return selectedEndpoint.pythonSnippet;
    return selectedEndpoint.curlSnippet;
  };

  const copyToClipboard = (text: string, type: "code" | "response") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Personal REST API Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NSE & BSE Personal Stock API Engine
            </h1>
            <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Your own institutional-grade Stock API. Access real-time price quotes, Level-2 Order Depth, multi-timeframe candles, volume metrics, and technical indicators for all Indian stocks.
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur-sm p-3.5 rounded-xl border border-slate-700/60 shrink-0">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Swagger Docs</div>
              <a 
                href="http://localhost:8000/docs" 
                target="_blank" 
                rel="noreferrer"
                className="text-sm font-bold text-white hover:text-emerald-400 transition-colors flex items-center space-x-1"
              >
                <span>http://localhost:8000/docs</span>
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-slate-400">Total Listed Universe</div>
            <div className="text-xl font-black text-white mt-1">
              {summaryData?.total_universe_stocks || 8641}+ Stocks
            </div>
          </div>
          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-slate-400">NSE Listed Companies</div>
            <div className="text-xl font-black text-emerald-400 mt-1">
              {summaryData?.nse_listed_count || 2978} Equities
            </div>
          </div>
          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-slate-400">BSE Codes & Exclusives</div>
            <div className="text-xl font-black text-sky-400 mt-1">
              {summaryData?.bse_listed_count || 5663} Securities
            </div>
          </div>
          <div className="bg-slate-800/40 p-3.5 rounded-xl border border-slate-800">
            <div className="text-xs font-medium text-slate-400">Order Depth Streams</div>
            <div className="text-xl font-black text-amber-400 mt-1">
              Level-2 Bids & Asks
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column API Explorer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Endpoints Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>Available Endpoints</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold text-xs">
              {ENDPOINTS.length} APIs
            </span>
          </div>

          <div className="space-y-2">
            {ENDPOINTS.map((ep) => {
              const isSelected = selectedEndpoint.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => handleSelectEndpoint(ep)}
                  className={`w-full text-left p-3.5 rounded-xl transition-all flex items-start justify-between space-x-3 border ${
                    isSelected
                      ? "bg-emerald-50/70 border-emerald-500/50 shadow-xs"
                      : "bg-slate-50/50 hover:bg-slate-100/60 border-slate-200/60"
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] tracking-wide">
                        {ep.method}
                      </span>
                      <span className={`text-xs font-bold truncate ${isSelected ? "text-emerald-900" : "text-slate-800"}`}>
                        {ep.title}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 truncate">
                      {ep.path}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 mt-1 shrink-0 ${isSelected ? "text-emerald-600" : "text-slate-400"}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Endpoint Tester & Code Snippet Generator */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Endpoint Details Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-black text-xs uppercase tracking-wider">
                  {selectedEndpoint.method}
                </span>
                <span className="text-sm font-mono font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {selectedEndpoint.path}
                </span>
              </div>
              <span className="inline-flex items-center text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                Category: {selectedEndpoint.category}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900">{selectedEndpoint.title}</h3>
              <p className="text-slate-600 text-sm mt-1 leading-relaxed">
                {selectedEndpoint.description}
              </p>
            </div>

            {/* Parameter Input & Execute Button */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                {selectedEndpoint.path.includes("{symbol}") ? "Symbol / Ticker Input:" : "Query Parameters Input:"}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={paramInput}
                  onChange={(e) => setParamInput(e.target.value)}
                  placeholder={selectedEndpoint.sampleParams}
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
                />
                <button
                  onClick={handleExecuteRequest}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center space-x-2 shrink-0 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 fill-white" />
                  )}
                  <span>{isLoading ? "Executing..." : "Execute API"}</span>
                </button>
              </div>
            </div>

            {/* Code Snippet Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 border-b border-slate-200 w-full">
                  <button
                    onClick={() => setActiveCodeLang("curl")}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                      activeCodeLang === "curl"
                        ? "border-emerald-600 text-emerald-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    cURL Command
                  </button>
                  <button
                    onClick={() => setActiveCodeLang("javascript")}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                      activeCodeLang === "javascript"
                        ? "border-emerald-600 text-emerald-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    JavaScript / Fetch
                  </button>
                  <button
                    onClick={() => setActiveCodeLang("python")}
                    className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
                      activeCodeLang === "python"
                        ? "border-emerald-600 text-emerald-600"
                        : "border-transparent text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Python / Requests
                  </button>
                </div>
              </div>

              <div className="relative bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                <button
                  onClick={() => copyToClipboard(getCodeSnippet(), "code")}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Copy code snippet"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <pre className="pr-8 whitespace-pre-wrap">{getCodeSnippet()}</pre>
              </div>
            </div>
          </div>

          {/* Live API Response Viewer */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2 font-bold text-slate-900 text-sm">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <span>Live Response Payload</span>
              </div>
              {apiResponse && (
                <button
                  onClick={() => copyToClipboard(apiResponse, "response")}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedResponse ? "Copied!" : "Copy JSON"}</span>
                </button>
              )}
            </div>

            <div className="bg-slate-950 text-emerald-400 rounded-xl p-4 font-mono text-xs min-h-[220px] max-h-[420px] overflow-y-auto border border-slate-800 shadow-inner">
              {isLoading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-3">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <span>Fetching live data from backend engine...</span>
                </div>
              ) : apiResponse ? (
                <pre className="whitespace-pre-wrap leading-relaxed">{apiResponse}</pre>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-12 space-y-2">
                  <Play className="w-8 h-8 text-slate-700 stroke-1" />
                  <p className="text-sm font-medium">Click "Execute API" to test this endpoint live.</p>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
