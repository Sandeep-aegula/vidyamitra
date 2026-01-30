from fastapi import APIRouter
import requests
from app.core.config import settings

router = APIRouter()

@router.get("/news")
def get_market_news(query: str = "technology"):
    if not settings.NEWS_API_KEY:
        return {"error": "News API not configured"}
        
    url = f"https://newsapi.org/v2/everything?q={query}&apiKey={settings.NEWS_API_KEY}"
    try:
        resp = requests.get(url)
        return resp.json().get("articles", [])[:5]
    except Exception:
        return []

@router.get("/listings")
def get_job_listings(role: str):
    # Mock listings as there is no specific "Naukri/LinkedIn" free public API provided
    # or specified other than "integrate News and Exchange APIs".
    # Assuming custom logic or mock for now.
    return [
        {"title": f"Senior {role}", "company": "Tech Corp", "location": "Remote"},
        {"title": f"Junior {role}", "company": "StartUp Inc", "location": "Bangalore"}
    ]

@router.get("/exchange-rates")
def get_exchange_rates(base_currency: str = "USD"):
    if not settings.EXCHANGE_API_KEY:
        return {"error": "Exchange API not configured"}
        
    url = f"https://v6.exchangerate-api.com/v6/{settings.EXCHANGE_API_KEY}/latest/{base_currency}"
    try:
        resp = requests.get(url)
        data = resp.json()
        if data.get("result") == "success":
             return data.get("conversion_rates", {})
        return {"error": "Failed to fetch rates"}
    except Exception:
        return {"error": "Service unavailable"}
