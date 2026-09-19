from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import Base, engine, SessionLocal
from app.models import UserProfile
from app.engine.broker_sync import sync_broker_portfolio
from app.routers import (
    portfolio, 
    analysis, 
    backtest, 
    risk, 
    markets, 
    indices, 
    discovery, 
    intelligence,
    auth,
    dashboard,
    stock_api_v1
)

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="NiveshDristi AI-Powered Intelligent Portfolio Optimization & Analytics Engine"
)

# Enable CORS for Next.js Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(portfolio.router, prefix=settings.API_V1_STR)

app.include_router(analysis.router, prefix=settings.API_V1_STR)
app.include_router(backtest.router, prefix=settings.API_V1_STR)
app.include_router(risk.router, prefix=settings.API_V1_STR)
app.include_router(markets.router, prefix=settings.API_V1_STR)
app.include_router(indices.router, prefix=settings.API_V1_STR)
app.include_router(discovery.router, prefix=settings.API_V1_STR)
app.include_router(intelligence.router, prefix=settings.API_V1_STR)
app.include_router(stock_api_v1.router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def startup_db_seed():
    """Seeds the SQLite database with 4 distinct user persona profiles for one-click testing."""
    db = SessionLocal()
    try:
        personas = [
            {
                "id": 1,
                "full_name": "Rahul Sharma",
                "email": "rahul@niveshdristi.in",
                "hashed_password": "demo123",
                "user_type": "RETAIL_INVESTOR",
                "risk_score": 6,
                "broker_connected": "Zerodha Kite",
                "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            },
            {
                "id": 2,
                "full_name": "Vikram Mehta",
                "email": "vikram@niveshdristi.in",
                "hashed_password": "demo123",
                "user_type": "PRO_TRADER",
                "risk_score": 9,
                "broker_connected": "Upstox Pro",
                "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
            },
            {
                "id": 3,
                "full_name": "Priya Nair",
                "email": "priya@niveshdristi.in",
                "hashed_password": "demo123",
                "user_type": "WEALTH_MANAGER",
                "risk_score": 4,
                "broker_connected": "ICICI Direct Prime",
                "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
            },
            {
                "id": 4,
                "full_name": "Dr. Aris Thorne",
                "email": "aris@niveshdristi.in",
                "hashed_password": "demo123",
                "user_type": "INSTITUTIONAL_ANALYST",
                "risk_score": 8,
                "broker_connected": "Bloomberg Terminal Sync",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
            }
        ]

        for p_data in personas:
            u = db.query(UserProfile).filter(UserProfile.id == p_data["id"]).first()
            if not u:
                u = UserProfile(**p_data)
                db.add(u)
                db.commit()
                db.refresh(u)
                sync_broker_portfolio(db, user_id=u.id, broker_name=u.broker_connected)
    finally:
        db.close()

@app.get("/")
def root():
    return {
        "status": "online",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "disclaimer": "Persistent Disclaimer: NiveshDristi provides data-driven algorithmic metrics and technical indicator translation, not fiduciary investment or financial advice."
    }
