from fastapi import APIRouter, Query
from typing import Optional
import requests
from app.core.config import settings
from app.services.job_service import search_jobs, format_job_data, get_sample_jobs

router = APIRouter()

@router.get("/search")
def search_job_listings(
    query: str = Query(..., description="Job title or keywords (e.g., 'Python Developer')"),
    location: str = Query("India", description="Location (e.g., 'Bangalore', 'Remote')"),
    employment_type: Optional[str] = Query(None, description="FULLTIME, PARTTIME, CONTRACTOR, INTERN"),
    date_posted: str = Query("all", description="all, today, 3days, week, month"),
    page: int = Query(1, ge=1, le=10, description="Page number")
):
    """
    Search for real-time job listings from LinkedIn, Indeed, Glassdoor, etc.
    Uses JSearch API (RapidAPI) to aggregate jobs from multiple platforms.
    Results are cached for 1 hour to reduce API calls.
    """
    api_response = search_jobs(
        query=query,
        location=location,
        employment_type=employment_type,
        date_posted=date_posted,
        page=page
    )
    
    if api_response.get("status") == "error":
        message = api_response.get("message", "Failed to fetch jobs.")
        # Return sample jobs so the page still shows something; frontend can show message as banner
        sample_jobs = get_sample_jobs(query, location, employment_type)
        return {
            "success": False,
            "message": message,
            "jobs": sample_jobs,
            "total": len(sample_jobs),
            "page": page,
            "sample": True
        }

    formatted_jobs = format_job_data(api_response)

    return {
        "success": True,
        "jobs": formatted_jobs,
        "total": len(formatted_jobs),
        "page": page,
        "message": f"Found {len(formatted_jobs)} jobs"
    }

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
    # Legacy endpoint - kept for backward compatibility
    # Redirects to new search endpoint
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
