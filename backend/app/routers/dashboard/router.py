from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

from app.database import get_db
from app.models import UserProfile, PortfolioHolding
from app.schemas import UserProfileResponse, PortfolioSummary
from app.routers.portfolio import get_portfolio_summary, get_user_holdings
from app.routers.intelligence import (
    simulate_stress_test, 
    get_rebalance_alerts, 
    get_tax_loss_harvesting, 
    get_correlation_matrix, 
    get_options_screener,
    get_rag_knowledge_stats,
    get_ai_track_record
)

router = APIRouter(prefix="/dashboard", tags=["User Dashboard Engine"])

@router.get("/overview")
def get_dashboard_overview(user_id: int = Query(1), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Returns complete dashboard overview tailored for the specified user persona ID.
    Includes User Profile, Portfolio Summary, Holdings Count, and Health Score.
    """
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        user = db.query(UserProfile).first()
    
    uid = user.id if user else 1
    summary = get_portfolio_summary(db=db, user_id=uid)
    holdings = get_user_holdings(db=db, user_id=uid)
    
    return {
        "status": "SUCCESS",
        "user": UserProfileResponse.model_validate(user) if user else None,
        "summary": summary,
        "holdings_count": len(holdings),
        "persona_type": str(user.user_type) if user else "RETAIL_INVESTOR"
    }

@router.get("/persona-analytics")
def get_persona_analytics(
    user_id: int = Query(1), 
    persona_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns persona-tailored analytical module data:
    - RETAIL_INVESTOR: Holdings overview & tax-loss harvesting
    - PRO_TRADER: Options setups & technical momentum
    - WEALTH_MANAGER: Rebalancing alerts & stress test scenarios
    - INSTITUTIONAL_ANALYST: RAG vector telemetry & AI accuracy log
    """
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    target_persona = persona_type or (user.user_type if user else "RETAIL_INVESTOR")

    if target_persona == "PRO_TRADER":
        options = get_options_screener()
        return {
            "persona": "PRO_TRADER",
            "title": "Pro Day & Swing Trader Analytics",
            "options_screener": options,
            "recommended_focus": "RSI / MACD Technical Breakouts & Derivatives Setup"
        }
    elif target_persona == "WEALTH_MANAGER":
        rebalance = get_rebalance_alerts(db=db)
        stress = simulate_stress_test(scenario_type="nifty_drop_20", db=db)
        correlation = get_correlation_matrix(db=db)
        return {
            "persona": "WEALTH_MANAGER",
            "title": "Wealth Management & Client Advisory Command",
            "rebalance_alerts": rebalance,
            "stress_test": stress,
            "correlation_matrix": correlation,
            "recommended_focus": "Allocation Drift, Client Risk Containment & Asset Correlation"
        }
    elif target_persona == "INSTITUTIONAL_ANALYST":
        stats = get_rag_knowledge_stats()
        track_record = get_ai_track_record()
        return {
            "persona": "INSTITUTIONAL_ANALYST",
            "title": "Institutional Quant & RAG Vector Engine Command",
            "knowledge_stats": stats,
            "track_record": track_record,
            "recommended_focus": "10.48M Record Knowledge Base & Vector Retraining Telemetry"
        }
    else: # RETAIL_INVESTOR
        tax = get_tax_loss_harvesting(db=db)
        summary = get_portfolio_summary(db=db)
        return {
            "persona": "RETAIL_INVESTOR",
            "title": "Retail Investor Portfolio Command",
            "portfolio_summary": summary,
            "tax_harvesting": tax,
            "recommended_focus": "Long-Term Wealth Accumulation & Tax-Loss Optimization"
        }
