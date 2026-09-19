import sys
import os

# Fix Windows console encoding for Rupee symbol
if sys.platform == "win32":
    getattr(sys.stdout, "reconfigure", lambda **kw: None)(encoding="utf-8")

from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_full_suite():
    print("================ RUNNING COMPLETE NIVESHDRISTI BACKEND TEST SUITE ================")
    
    # 1. Root & Health
    r = client.get("/")
    assert r.status_code == 200, f"Root failed: {r.text}"
    print("✔ 1. Testing Root Endpoint")

    # 2. Portfolio Summary
    r = client.get("/api/portfolio/summary")
    assert r.status_code == 200, f"Summary failed: {r.text}"
    data = r.json()
    assert "total_investment" in data
    assert "total_current_value" in data
    print("✔ 2. Testing Portfolio Summary & Concentration Risk")

    # 3. Holdings
    r = client.get("/api/portfolio/holdings")
    assert r.status_code == 200, f"Holdings failed: {r.text}"
    holdings = r.json()
    assert len(holdings) > 0, "No holdings found"
    holding_id = holdings[0]["id"]
    ticker = holdings[0]["ticker"]
    print(f"✔ 3. Testing User Holdings with Badges & Composite Scores ({len(holdings)} holdings)")

    # 4. Technical Analysis
    r = client.get(f"/api/analysis/technical/{ticker}")
    assert r.status_code == 200, f"Technical failed: {r.text}"
    tech = r.json()
    assert "composite_score" in tech
    assert "rsi_14" in tech
    print("✔ 4. Testing Multi-Indicator Technical Engine & FinBERT Sentiment")

    # 5. Smart Swap
    r = client.get(f"/api/analysis/alternative/{holding_id}")
    assert r.status_code == 200, f"Swap failed: {r.text}"
    swap_data = r.json()
    assert "alternative_ticker" in swap_data
    print(f"✔ 5. Testing AI Swap Engine & RAG Rationales (Alternative: {swap_data['alternative_ticker']})")

    # 6. Backtest Sandbox
    r = client.get(f"/api/backtest/run?ticker={ticker}&timeframe_years=3")
    assert r.status_code == 200, f"Backtest failed: {r.text}"
    bt = r.json()
    assert "cagr_strategy_pct" in bt
    print("✔ 6. Testing Backtesting Sandbox (3Y)")

    # 7. Stock Screener & Search
    r = client.get("/api/markets/search?q=TCS")
    assert r.status_code == 200, f"Search failed: {r.text}"
    results = r.json()
    assert len(results) > 0
    print(f"✔ 7. Testing Live Stock Screener & Search ({len(results)} matches for 'TCS')")

    # 8. Top Movers
    r = client.get("/api/markets/movers")
    assert r.status_code == 200, f"Movers failed: {r.text}"
    movers = r.json()
    assert len(movers["largecap_gainers"]) > 0
    assert len(movers["midcap_gainers"]) > 0
    assert len(movers["smallcap_gainers"]) > 0
    print("✔ 8. Testing Top Movers (Large Cap, Mid Cap, Small Cap)")

    # 9. Day's Sector Movements
    r = client.get("/api/markets/sectors")
    assert r.status_code == 200, f"Sectors failed: {r.text}"
    sectors = r.json()
    assert len(sectors) == 12
    print(f"✔ 9. Testing Day's Sector Movements ({len(sectors)} NSE sectors)")

    # 10. Indian Indices (Groww-Style)
    r = client.get("/api/indices/indian")
    assert r.status_code == 200, f"Indian indices failed: {r.text}"
    ind_indices = r.json()
    assert len(ind_indices) >= 15
    print(f"✔ 10. Testing Indian Indices Hub ({len(ind_indices)} Indian indices: Nifty 50, Sensex, Sectorals, Mid/Smallcap)")

    # 11. Global Indices
    r = client.get("/api/indices/global")
    assert r.status_code == 200, f"Global indices failed: {r.text}"
    glob_indices = r.json()
    assert len(glob_indices) >= 10
    print(f"✔ 11. Testing Global Indices Hub ({len(glob_indices)} Global indices: S&P 500, Nasdaq, Nikkei, FTSE, DAX, etc.)")

    # 12. Discovery Hub (IPOs, Bonds, ETFs)
    r_ipo = client.get("/api/discovery/ipos")
    r_bonds = client.get("/api/discovery/bonds")
    r_etfs = client.get("/api/discovery/etfs")
    assert r_ipo.status_code == 200 and r_bonds.status_code == 200 and r_etfs.status_code == 200
    print(f"✔ 12. Testing Discovery Hub (IPOs with GMP, Bonds & SGBs, ETFs)")

    # 13. Stress Testing
    r = client.post("/api/intelligence/stress-test?scenario_type=nifty_drop_20")
    assert r.status_code == 200, f"Stress test failed: {r.text}"
    st = r.json()
    assert "projected_portfolio_loss" in st
    print("✔ 13. Testing Portfolio Stress Testing ('What if Nifty drops 20%?')")

    # 14. Rebalancing Alerts
    r = client.get("/api/intelligence/rebalance-alerts")
    assert r.status_code == 200, f"Rebalancing alerts failed: {r.text}"
    print("✔ 14. Testing Rebalancing Alerts & Allocation Drift")

    # 15. Tax-Loss Harvesting
    r = client.get("/api/intelligence/tax-loss-harvesting")
    assert r.status_code == 200, f"Tax loss failed: {r.text}"
    print("✔ 15. Testing Tax-Loss Harvesting Engine")

    # 16. Correlation Matrix
    r = client.get("/api/intelligence/correlation-matrix")
    assert r.status_code == 200, f"Correlation failed: {r.text}"
    assert "matrix" in r.json()
    print("✔ 16. Testing Correlation Matrix")

    # 17. Options Screener
    r = client.get("/api/intelligence/options-screener")
    assert r.status_code == 200, f"Options screener failed: {r.text}"
    options = r.json()
    assert len(options) > 0
    print(f"✔ 17. Testing Options Screener (RSI-based Call/Put setups)")

    # 18. AI Dataset Knowledge Stats & Training
    r_stats = client.get("/api/intelligence/knowledge-stats")
    assert r_stats.status_code == 200, f"Knowledge stats failed: {r_stats.text}"
    stats = r_stats.json()
    assert stats["total_indexed_records"] >= 10000000
    print(f"✔ 18. Testing AI Knowledge Stats ({stats['total_indexed_records']:,} Indexed Records)")

    # 19. AI Model Dataset Training
    r_train = client.post("/api/intelligence/train-rag?batch_size=1000000")
    assert r_train.status_code == 200, f"Train RAG failed: {r_train.text}"
    train_res = r_train.json()
    assert train_res["status"] == "SUCCESS"
    assert train_res["batch_records_added"] == 1000000
    print(f"✔ 19. Testing AI Dataset Training (+1,000,000 Records Batch)")

    # 20. AI Performance Track Record
    r_rec = client.get("/api/intelligence/ai-track-record")
    assert r_rec.status_code == 200, f"Track record failed: {r_rec.text}"
    rec = r_rec.json()
    assert rec["target_met_rate_pct"] >= 90.0
    print(f"✔ 20. Testing AI Accuracy Track Record ({rec['target_met_rate_pct']}% Target Precision)")

    # 21. User Demo One-Click Login Personas
    for persona in ["RETAIL_INVESTOR", "PRO_TRADER", "WEALTH_MANAGER", "INSTITUTIONAL_ANALYST"]:
        r_demo = client.post("/api/auth/demo-login", json={"user_type": persona})
        assert r_demo.status_code == 200, f"Demo login failed for {persona}: {r_demo.text}"
        demo_res = r_demo.json()
        assert demo_res["status"] == "SUCCESS"
        assert demo_res["user"]["user_type"] == persona
    print("✔ 21. Testing One-Click Login Personas (Retail, Pro Trader, Wealth Manager, Quant)")

    # 22. User Custom Registration (Signup)
    test_email = f"test_{os.urandom(4).hex()}@niveshdristi.in"
    r_signup = client.post("/api/auth/signup", json={
        "full_name": "Test Trader",
        "email": test_email,
        "password": "Password123!",
        "user_type": "PRO_TRADER",
        "risk_score": 8,
        "broker_connected": "Upstox Pro"
    })
    assert r_signup.status_code == 200, f"Signup failed: {r_signup.text}"
    signup_res = r_signup.json()
    assert signup_res["user"]["email"] == test_email
    print(f"✔ 22. Testing User Registration & SQLite DB Persistence ({test_email})")

    # 23. User Login
    r_login = client.post("/api/auth/login", json={
        "email": test_email,
        "password": "Password123!"
    })
    assert r_login.status_code == 200, f"Login failed: {r_login.text}"
    login_res = r_login.json()
    assert login_res["access_token"].startswith("niveshdristi_token_")
    print("✔ 23. Testing User Authentication & Token Generation")

    # 24. Active User Profile Fetch (/api/auth/me)
    r_me = client.get(f"/api/auth/me?user_id={login_res['user']['id']}")
    assert r_me.status_code == 200, f"Fetch profile failed: {r_me.text}"
    assert r_me.json()["email"] == test_email
    print("✔ 24. Testing Fetch Active User Profile (/api/auth/me)")

    print("================ ALL 24 BACKEND TESTS PASSED WITH 100% SUCCESS! ================")

if __name__ == "__main__":
    test_full_suite()


