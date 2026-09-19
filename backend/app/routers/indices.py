from fastapi import APIRouter
from typing import List
from concurrent.futures import ThreadPoolExecutor
from app.schemas import MarketIndexItem
from app.engine.market_data import INDIAN_INDICES, GLOBAL_INDICES, get_live_index_quote

router = APIRouter(prefix="/indices", tags=["Indices"])

@router.get("/indian", response_model=List[MarketIndexItem])
def get_indian_indices():
    """Returns real-time status of all 37 authentic Indian Market Indices (Nifty 50, Sensex, Sectorals, MidCap, SmallCap, etc.)."""
    with ThreadPoolExecutor(max_workers=15) as executor:
        results = list(executor.map(get_live_index_quote, INDIAN_INDICES))
    return results

@router.get("/global", response_model=List[MarketIndexItem])
def get_global_indices():
    """Returns real-time status of all 21 major World Global Market Indices (US, Europe, Asia-Pacific, Americas)."""
    with ThreadPoolExecutor(max_workers=15) as executor:
        results = list(executor.map(get_live_index_quote, GLOBAL_INDICES))
    return results

