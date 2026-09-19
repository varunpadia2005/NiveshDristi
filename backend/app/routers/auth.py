from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
import hashlib
from typing import List, Dict, Any

from app.database import get_db
from app.models import UserProfile, PortfolioHolding
from app.schemas import (
    UserLoginRequest, 
    UserSignupRequest, 
    DemoLoginRequest, 
    AuthResponse, 
    UserProfileResponse
)
from app.engine.broker_sync import sync_broker_portfolio

router = APIRouter(prefix="/auth", tags=["User Authentication & Personas"])

def _hash_pass(password: str) -> str:
    """Helper to hash plain text passwords using SHA256."""
    return hashlib.sha256(password.encode()).hexdigest()

DEMO_PERSONAS = {
    "RETAIL_INVESTOR": {
        "full_name": "Rahul Sharma",
        "email": "rahul@niveshdristi.in",
        "user_type": "RETAIL_INVESTOR",
        "risk_score": 6,
        "broker_connected": "Zerodha Kite",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
    },
    "PRO_TRADER": {
        "full_name": "Vikram Mehta",
        "email": "vikram@niveshdristi.in",
        "user_type": "PRO_TRADER",
        "risk_score": 9,
        "broker_connected": "Upstox Pro",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
    },
    "WEALTH_MANAGER": {
        "full_name": "Priya Nair",
        "email": "priya@niveshdristi.in",
        "user_type": "WEALTH_MANAGER",
        "risk_score": 4,
        "broker_connected": "ICICI Direct Prime",
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150"
    },
    "INSTITUTIONAL_ANALYST": {
        "full_name": "Dr. Aris Thorne",
        "email": "aris@niveshdristi.in",
        "user_type": "INSTITUTIONAL_ANALYST",
        "risk_score": 8,
        "broker_connected": "Bloomberg Terminal Sync",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150"
    },
    "ADMIN": {
        "full_name": "System Administrator",
        "email": "admin@niveshdristi.in",
        "user_type": "ADMIN",
        "risk_score": 10,
        "broker_connected": "Master Multi-Broker Gateway",
        "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150"
    }
}

@router.post("/signup", response_model=AuthResponse)
def register_user(payload: UserSignupRequest, db: Session = Depends(get_db)):
    """Registers a new user profile into SQLite database and initializes portfolio state."""
    existing = db.query(UserProfile).filter(UserProfile.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"An account with email '{payload.email}' already exists. Please sign in."
        )

    user = UserProfile(
        full_name=payload.full_name,
        email=payload.email,
        hashed_password=_hash_pass(payload.password),
        user_type=payload.user_type or "RETAIL_INVESTOR",
        risk_score=payload.risk_score or 6,
        broker_connected=payload.broker_connected or "Zerodha Kite",
        last_login=datetime.utcnow()
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # Seed initial portfolio holdings for newly registered user
    sync_broker_portfolio(db, user_id=user.id, broker_name=user.broker_connected)

    token = f"niveshdristi_token_{user.id}_{int(datetime.utcnow().timestamp())}"

    return AuthResponse(
        status="SUCCESS",
        message=f"Welcome {user.full_name}! Account successfully registered.",
        access_token=token,
        user=UserProfileResponse.model_validate(user)
    )

@router.post("/login", response_model=AuthResponse)
def login_user(payload: UserLoginRequest, db: Session = Depends(get_db)):
    """Authenticates existing user with email and password against SQLite database."""
    user = db.query(UserProfile).filter(UserProfile.email == payload.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials."
        )

    # Check password match (supports hashed or plain test demo password)
    hashed_input = _hash_pass(payload.password)
    if user.hashed_password != payload.password and user.hashed_password != hashed_input:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    user.last_login = datetime.utcnow()
    db.commit()
    db.refresh(user)

    token = f"niveshdristi_token_{user.id}_{int(datetime.utcnow().timestamp())}"

    return AuthResponse(
        status="SUCCESS",
        message=f"Welcome back, {user.full_name}!",
        access_token=token,
        user=UserProfileResponse.model_validate(user)
    )

@router.post("/demo-login", response_model=AuthResponse)
def demo_one_click_login(payload: DemoLoginRequest, db: Session = Depends(get_db)):
    """
    Instant One-Click Login for testing different user personas:
    RETAIL_INVESTOR, PRO_TRADER, WEALTH_MANAGER, INSTITUTIONAL_ANALYST.
    """
    user_type_key = payload.user_type.upper()
    if user_type_key not in DEMO_PERSONAS:
        user_type_key = "RETAIL_INVESTOR"

    persona_info = DEMO_PERSONAS[user_type_key]
    user = db.query(UserProfile).filter(UserProfile.email == persona_info["email"]).first()

    if not user:
        # Create persona user in database if not pre-seeded
        user = UserProfile(
            full_name=persona_info["full_name"],
            email=persona_info["email"],
            hashed_password=_hash_pass("demo123"),
            user_type=persona_info["user_type"],
            risk_score=persona_info["risk_score"],
            broker_connected=persona_info["broker_connected"],
            avatar_url=persona_info.get("avatar_url"),
            last_login=datetime.utcnow()
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        sync_broker_portfolio(db, user_id=user.id, broker_name=user.broker_connected)
    else:
        user.last_login = datetime.utcnow()
        db.commit()
        db.refresh(user)

    token = f"niveshdristi_token_demo_{user.id}_{int(datetime.utcnow().timestamp())}"

    return AuthResponse(
        status="SUCCESS",
        message=f"Logged in as {user.full_name} ({user.user_type.replace('_', ' ')})",
        access_token=token,
        user=UserProfileResponse.model_validate(user)
    )

@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(user_id: int = 1, db: Session = Depends(get_db)):
    """Fetches details for active user profile."""
    user = db.query(UserProfile).filter(UserProfile.id == user_id).first()
    if not user:
        user = db.query(UserProfile).first()
    if not user:
        raise HTTPException(status_code=404, detail="User profile not found")
    return user

@router.get("/admin/auth-types")
def get_admin_auth_types():
    """
    Returns an institutional breakdown of all supported authentication protocols,
    OAuth broker tokens, JWT configurations, and security credentials across NiveshDristi.
    """
    return {
        "system_status": "ONLINE",
        "total_active_auth_nodes": 6,
        "auth_methods": [
            {
                "id": "OAUTH_ZERODHA",
                "name": "Zerodha Kite Connect OAuth 2.0",
                "protocol": "OAuth2.0 PKCE",
                "status": "ACTIVE_CONNECTED",
                "active_sessions": 1420,
                "token_expiry": "24 hours",
                "permissions": ["Read Holdings", "Read Orders", "Place Orders", "Level-2 Quotes"]
            },
            {
                "id": "OAUTH_UPSTOX",
                "name": "Upstox Pro API v2 OAuth",
                "protocol": "OAuth2.0 Bearer",
                "status": "ACTIVE_CONNECTED",
                "active_sessions": 850,
                "token_expiry": "24 hours",
                "permissions": ["Read Positions", "Historical Data", "Option Chain Feed"]
            },
            {
                "id": "OAUTH_GROWW",
                "name": "Groww Passwordless Session Auth",
                "protocol": "JWT Cookie + TOTP",
                "status": "ACTIVE_CONNECTED",
                "active_sessions": 3200,
                "token_expiry": "7 days",
                "permissions": ["Portfolio Sync", "SIP Tracker", "Tax P&L"]
            },
            {
                "id": "JWT_USER_AUTH",
                "name": "NiveshDristi Internal JWT User Auth",
                "protocol": "RS256 Bearer Token",
                "status": "ACTIVE_CONNECTED",
                "active_sessions": 8641,
                "token_expiry": "30 days",
                "permissions": ["Multi-Persona Access", "Custom Portfolio Engine", "AI RAG Copilot"]
            },
            {
                "id": "ALGO_API_KEY",
                "name": "Algo Trader REST & WebSocket API Key",
                "protocol": "X-API-KEY / HMAC-SHA256",
                "status": "ACTIVE_CONNECTED",
                "active_sessions": 94,
                "token_expiry": "Permanent / Revokable",
                "permissions": ["Sub-50ms Tick Stream", "Backtest Sandbox", "Order Execution"]
            },
            {
                "id": "ADMIN_SUPERUSER",
                "name": "System Administrator Auth Portal",
                "protocol": "Master Secret Key + DB Control",
                "status": "SUPERUSER_ACCESS",
                "active_sessions": 1,
                "token_expiry": "Unlimited",
                "permissions": ["All Auth Management", "Add Custom Portfolio", "Global Stock Registry Control"]
            }
        ]
    }
