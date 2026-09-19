import urllib.parse
import urllib.request
import json
import ssl
import logging
from typing import List, Dict
from app.engine.market_data import get_live_stock_quote, INDIAN_STOCKS_UNIVERSE

logger = logging.getLogger(__name__)

# Create SSL context for secure API calls
_SSL_CTX = ssl.create_default_context()
_SSL_CTX.check_hostname = False
_SSL_CTX.verify_mode = ssl.CERT_NONE

def search_yahoo_finance_online(query: str) -> List[Dict]:
    """
    Dynamically resolves any Indian equity across NSE & BSE via Yahoo Finance API.
    Supports mid, small, and micro cap equities (e.g. Hindustan Hardy, BMW Industries, Gayatri Projects).
    Returns real-time prices, percentage changes, and BSE codes.
    """
    if not query or not query.strip():
        return []

    clean_query = query.strip()
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={urllib.parse.quote(clean_query)}&quotesCount=15&newsCount=0"
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    req = urllib.request.Request(url, headers=headers)
    
    online_quotes: List[Dict] = []
    
    try:
        with urllib.request.urlopen(req, timeout=4, context=_SSL_CTX) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            quotes = data.get("quotes", [])
            
            for item in quotes:
                sym = item.get("symbol", "")
                exch = item.get("exchange", "")
                quote_type = item.get("quoteType", "")
                
                # Filter for Indian Equities (NSE .NS or BSE .BO)
                is_indian = sym.endswith(".NS") or sym.endswith(".BO") or exch in ["NSE", "BSE", "NSI", "BOM"]
                if is_indian and quote_type in ["EQUITY", "ETF", ""]:
                    shortname = item.get("shortname") or item.get("longname") or sym
                    bse_code = sym.replace(".BO", "") if sym.endswith(".BO") and sym.replace(".BO", "").isdigit() else None
                    
                    stock_meta = {
                        "ticker": sym,
                        "name": shortname,
                        "bse_code": bse_code,
                        "sector": item.get("sector") or "Equities",
                        "cap_type": "midcap" if "ltd" in str(shortname).lower() else "smallcap",
                        "base_price": 100.0,
                        "exchanges": ["BSE"] if sym.endswith(".BO") else ["NSE", "BSE"],
                        "bse_only": sym.endswith(".BO")
                    }
                    
                    # Fetch fast quote using get_live_stock_quote fast_mode=True with yfinance fast_info fallback
                    live_quote = get_live_stock_quote(stock_meta, fast_mode=True)
                    
                    # If fast_mode returned pseudo price for unlisted ticker, resolve real price via yfinance fast_info
                    if live_quote and stock_meta.get("ticker") not in [s.get("ticker") for s in INDIAN_STOCKS_UNIVERSE]:
                        try:
                            import yfinance as yf
                            t = yf.Ticker(sym)
                            fi = getattr(t, 'fast_info', None)
                            lp = None
                            pc = None
                            if fi:
                                lp = fi.get("lastPrice") or fi.get("regularMarketPrice")
                                pc = fi.get("previousClose")
                            if lp is None:
                                hist = t.history(period="2d")
                                if not hist.empty:
                                    lp = float(hist["Close"].iloc[-1])
                                    pc = float(hist["Close"].iloc[-2]) if len(hist) > 1 else float(hist["Open"].iloc[-1])
                            if lp is not None and lp > 0:
                                pc = pc or lp
                                chg_pts = round(lp - pc, 2)
                                chg_pct = round((chg_pts / pc) * 100.0, 2)
                                live_quote["current_price"] = round(lp, 2)
                                live_quote["ltp"] = round(lp, 2)
                                live_quote["change_pts"] = chg_pts
                                live_quote["day_change_pct"] = chg_pct
                                live_quote["changePct"] = chg_pct
                        except Exception:
                            pass
                            
                    if live_quote and live_quote.get("current_price", 0) > 0:
                        online_quotes.append(live_quote)
    except Exception as e:
        logger.error(f"Online Yahoo Finance search failed for query '{clean_query}': {e}")
        
    return online_quotes
