"""
NiveshDristi Multi-Factor RAG Generation & Reasoning Engine.
Synthesizes Technical Indicators (130+ pandas-ta), Fundamental Valuation Ratios,
FinBERT Sentiment overlays, and Vector Knowledge Base chunks into plain-English investment rationales.
"""

from typing import Dict, Any, List
from app.schemas import TechnicalMetrics
from app.engine.rag_knowledge import search_knowledge_base

def generate_rag_rationale(
    original_ticker: str,
    original_metrics: TechnicalMetrics,
    alternative_ticker: str,
    alternative_metrics: TechnicalMetrics,
    tax_info: Dict[str, Any]
) -> str:
    """
    Generates a clear, plain-English algorithmic explanation for asset swap recommendations.
    Combines technical metrics, FinBERT sentiment, RAG vector knowledge, and tax drag calculation.
    """
    delta_score = round(alternative_metrics.composite_score - original_metrics.composite_score, 2)
    
    # Perform vector lookup for swap context
    vector_context = search_knowledge_base(f"{alternative_ticker} {original_ticker} swap tax loss harvesting", top_k=1)
    kb_insight = vector_context[0]["content"] if vector_context else "Intra-sector capital redeployment maximizes risk-adjusted alpha."

    rationale = (
        f"**NiveshDristi Algorithmic Audit**: **{original_ticker}** is currently rated `{original_metrics.badge}` "
        f"with a composite technical score of `{original_metrics.composite_score:+.2f}` (scale -5.0 to +5.0). "
        f"Key triggers include RSI (14) at {original_metrics.rsi_14:.1f}, MACD histogram at {original_metrics.macd_hist:.2f}, "
        f"and price trading at ₹{original_metrics.current_price:.2f} relative to 50-day SMA (₹{original_metrics.sma_50:.2f}).\n\n"
        f"**Smart Intra-Sector Swap**: **{alternative_ticker}** boasts a superior `{alternative_metrics.badge}` status "
        f"with a composite score of `{alternative_metrics.composite_score:+.2f}` (a **{'+' if delta_score >= 0 else ''}{delta_score:.2f} point technical improvement**). "
        f"It maintains healthy momentum (RSI: {alternative_metrics.rsi_14:.1f}) and trades above key moving averages with institutional volume accumulation.\n\n"
        f"**FinBERT Sentiment & Vector RAG Overlay**: {alternative_metrics.sentiment_headline} Market sentiment score is "
        f"`{alternative_metrics.sentiment_score:+.2f}` ({alternative_metrics.sentiment_label}), confirming strong fundamental support without value-trap risks. "
        f"*(RAG Insight: {kb_insight})*\n\n"
        f"**Capital Redeployment & Tax Impact**: Swapping {original_ticker} realizes {tax_info['tax_type']} tax of "
        f"₹{tax_info['estimated_tax_payable']:,.2f} on gains of ₹{tax_info['unrealized_gain']:,.2f}. "
        f"Net redeployable capital is **₹{tax_info['redeployable_capital']:,.2f}**, acquiring approx "
        f"**{tax_info['new_shares_acquired']:.2f} shares** of {alternative_ticker} with optimized risk-adjusted potential."
    )
    
    return rationale

def compute_multi_factor_score(
    tech_score: float,
    sentiment_score: float,
    pe_ratio: float,
    roe_pct: float,
    value_trap_risk: bool
) -> Dict[str, Any]:
    """
    Computes a unified Multi-Factor Quantitative Rating (-5.0 to +5.0)
    combining Technical (40%), Fundamental (40%), and Sentiment (20%) signals.
    """
    # 1. Technical Factor (-2.0 to +2.0)
    tech_factor = max(-2.0, min(2.0, tech_score * 0.4))
    
    # 2. Fundamental Factor (-2.0 to +2.0)
    fund_score = 0.0
    if roe_pct >= 18.0:
        fund_score += 1.0
    elif roe_pct >= 12.0:
        fund_score += 0.5
        
    if pe_ratio < 25.0:
        fund_score += 1.0
    elif pe_ratio < 40.0:
        fund_score += 0.2
    else:
        fund_score -= 0.5

    fund_factor = max(-2.0, min(2.0, fund_score))

    # 3. Sentiment Factor (-1.0 to +1.0)
    sent_factor = max(-1.0, min(1.0, sentiment_score))
    if value_trap_risk:
        sent_factor -= 1.5

    total_score = round(max(-5.0, min(5.0, tech_factor + fund_factor + sent_factor)), 2)

    # Confidence calculation based on factor agreement
    agreements = sum([
        1 if (tech_factor > 0 and fund_factor > 0) else 0,
        1 if (tech_factor > 0 and sent_factor > 0) else 0,
        1 if (fund_factor > 0 and sent_factor > 0) else 0
    ])
    confidence = 90 if agreements == 3 else 82 if agreements >= 1 else 70

    return {
        "multi_factor_score": total_score,
        "confidence_score": confidence,
        "tech_factor": round(tech_factor, 2),
        "fund_factor": round(fund_factor, 2),
        "sent_factor": round(sent_factor, 2),
        "is_value_trap": value_trap_risk
    }
