from typing import Dict, Any
import hashlib

# Expanded curated financial sentiment database for Indian equity universe
FINANCIAL_NEWS_DATABASE = {
    "TCS.NS": {
        "headline": "TCS bags $1.2B mega-deal in European cloud migration; operating margins expand 80bps to 26.2%.",
        "sentiment_score": 0.78,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "INFY.NS": {
        "headline": "Infosys raises FY revenue guidance to 4.5-5.0% on strong enterprise digital transformation demand.",
        "sentiment_score": 0.70,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "HCLTECH.NS": {
        "headline": "HCL Tech delivers record deal wins in engineering R&D services; declares ₹12 quarterly dividend.",
        "sentiment_score": 0.64,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "WIPRO.NS": {
        "headline": "Wipro faces leadership restructuring and consulting slowdown; Q3 revenue contracts 1.1% YoY.",
        "sentiment_score": -0.45,
        "sentiment_label": "BEARISH",
        "value_trap_risk": True
    },
    "TECHM.NS": {
        "headline": "Tech Mahindra restructures telecom vertical; short-term margin headwinds persist during portfolio cleanup.",
        "sentiment_score": -0.22,
        "sentiment_label": "BEARISH",
        "value_trap_risk": False
    },
    "RELIANCE.NS": {
        "headline": "Reliance Retail EBITDA surges 21% YoY while New Energy solar giga-factory commissioning begins.",
        "sentiment_score": 0.65,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "NTPC.NS": {
        "headline": "NTPC Green Energy IPO subscribed 14.2x; targets 60GW clean power capacity by 2030.",
        "sentiment_score": 0.82,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "ONGC.NS": {
        "headline": "ONGC benefits from steady crude realization near $78/bbl; windfall tax adjustments absorbed.",
        "sentiment_score": 0.25,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "BPCL.NS": {
        "headline": "BPCL reports robust marketing margins and record refining throughput; interim dividend announced.",
        "sentiment_score": 0.48,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "POWERGRID.NS": {
        "headline": "Power Grid capitalizes on interstate transmission tariff orders with stable 15.5% ROE.",
        "sentiment_score": 0.72,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "HDFCBANK.NS": {
        "headline": "HDFC Bank deposit growth outpaces credit expansion (18.2% YoY); CDR normalizes to pre-merger 88%.",
        "sentiment_score": 0.74,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "ICICIBANK.NS": {
        "headline": "ICICI Bank posts 17.5% YoY PAT growth with pristine asset quality (Net NPA at 0.42%) & 2.36% ROA.",
        "sentiment_score": 0.88,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "SBIN.NS": {
        "headline": "SBI credit expansion strong across SME & retail; slippages decline to multi-year low of 0.78%.",
        "sentiment_score": 0.68,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "KOTAKBANK.NS": {
        "headline": "Kotak Mahindra Bank resolves RBI tech audit remedies; credit card customer onboarding fully resumed.",
        "sentiment_score": 0.62,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "AXISBANK.NS": {
        "headline": "Axis Bank achieves full Citi integration synergies; wealth management AUM grows 28%.",
        "sentiment_score": 0.58,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "TATAMOTORS.NS": {
        "headline": "Tata Motors demerger into commercial and passenger/EV businesses approved by NCLT; unlocks valuation.",
        "sentiment_score": 0.80,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "M&M.NS": {
        "headline": "Mahindra & Mahindra SUV order backlog reaches 220k units; tractor market share expands to 42.5%.",
        "sentiment_score": 0.85,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "MARUTI.NS": {
        "headline": "Maruti Suzuki hybrid model sales accelerate; export volumes to Japan and Africa jump 19%.",
        "sentiment_score": 0.60,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "BHARTIARTL.NS": {
        "headline": "Bharti Airtel ARPU expands to ₹211 supported by tariff revisions and 5G subscriber migration.",
        "sentiment_score": 0.82,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "MAZDOCK.NS": {
        "headline": "Mazagon Dock bags ₹4,600 Cr defense submarine construction contract; order book stands at ₹38,500 Cr.",
        "sentiment_score": 0.90,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "HAL.NS": {
        "headline": "Hindustan Aeronautics receives MoD approval for 97 Tejas Mark 1A fighter jet delivery roadmap.",
        "sentiment_score": 0.86,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "HINDUNILVR.NS": {
        "headline": "Hindustan Unilever sees gradual rural FMCG volume recovery; raw material price stability protects margins.",
        "sentiment_score": 0.42,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "ITC.NS": {
        "headline": "ITC Hotels demerger listing nears completion; cigarette volume growth remains steady at 4%.",
        "sentiment_score": 0.55,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "SUNPHARMA.NS": {
        "headline": "Sun Pharma specialty portfolio revenue expands 18% YoY led by Ilumya and Cequua global adoption.",
        "sentiment_score": 0.72,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    },
    "TATASTEEL.NS": {
        "headline": "Tata Steel UK green electric arc furnace transformation funded; Indian operations maintain strong 22% margin.",
        "sentiment_score": 0.40,
        "sentiment_label": "BULLISH",
        "value_trap_risk": False
    }
}

def analyze_sentiment(ticker: str) -> Dict[str, Any]:
    """
    Simulates FinBERT-based contextual NLP sentiment scoring across market news and social feeds.
    Flags value-trap risks when sentiment is intensely negative.
    """
    clean_ticker = ticker.upper().strip()
    
    if clean_ticker in FINANCIAL_NEWS_DATABASE:
        return FINANCIAL_NEWS_DATABASE[clean_ticker]
    
    # Deterministic dynamic sentiment based on ticker hash for uncatalogued stocks
    val = (int(hashlib.md5(clean_ticker.encode()).hexdigest(), 16) % 100) / 100.0  # 0.0 to 0.99
    score = round((val * 1.8) - 0.8, 2) # -0.8 to +1.0
    
    if score >= 0.20:
        label = "BULLISH"
        risk = False
        headline = f"Positive institutional accumulation and solid operational momentum reported for {clean_ticker}."
    elif score <= -0.20:
        label = "BEARISH"
        risk = (score <= -0.40)
        headline = f"Sector headwind cautions and conservative analyst earnings revisions noted for {clean_ticker}."
    else:
        label = "NEUTRAL"
        risk = False
        headline = f"Balanced market sentiment and rangebound analyst expectations for {clean_ticker}."
        
    return {
        "headline": headline,
        "sentiment_score": score,
        "sentiment_label": label,
        "value_trap_risk": risk
    }
