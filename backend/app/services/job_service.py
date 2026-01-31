import requests
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.core.config import settings

# Simple in-memory cache
job_cache = {}
CACHE_DURATION = timedelta(hours=1)

def search_jobs(
    query: str,
    location: str = "India",
    employment_type: Optional[str] = None,
    date_posted: str = "all",
    page: int = 1
) -> Dict:
    """
    Search for jobs using JSearch API
    
    Args:
        query: Job title or keywords (e.g., "Python Developer")
        location: Location (e.g., "Bangalore, India")
        employment_type: FULLTIME, PARTTIME, CONTRACTOR, INTERN
        date_posted: all, today, 3days, week, month
        page: Page number for pagination
    """
    
    # Check cache
    cache_key = f"{query}_{location}_{employment_type}_{date_posted}_{page}"
    if cache_key in job_cache:
        cached_data, cached_time = job_cache[cache_key]
        if datetime.now() - cached_time < CACHE_DURATION:
            print(f"Returning cached results for: {cache_key}")
            return cached_data
    
    if not settings.JSEARCH_API_KEY:
        return {
            "status": "error",
            "message": "JSearch API key not configured. Please add JSEARCH_API_KEY to your .env file.",
            "data": []
        }
    
    url = "https://jsearch.p.rapidapi.com/search"
    
    params = {
        "query": f"{query} in {location}",
        "page": str(page),
        "num_pages": "1",
        "date_posted": date_posted
    }
    
    if employment_type:
        params["employment_types"] = employment_type
    
    headers = {
        "X-RapidAPI-Key": settings.JSEARCH_API_KEY,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com"
    }
    
    try:
        print(f"Fetching jobs from JSearch API: {query} in {location}")
        response = requests.get(url, headers=headers, params=params, timeout=10)

        if response.status_code == 403:
            return {
                "status": "error",
                "message": "JSearch API access denied (403). Subscribe to JSearch on RapidAPI (free tier available), then add JSEARCH_API_KEY to your backend .env. Get your key: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch",
                "data": []
            }

        response.raise_for_status()
        data = response.json()

        # Cache the result
        job_cache[cache_key] = (data, datetime.now())
        print(f"Cached {len(data.get('data', []))} jobs")

        return data
    except requests.exceptions.RequestException as e:
        print(f"JSearch API Error: {e}")
        msg = str(e)
        if "403" in msg or "Forbidden" in msg:
            return {
                "status": "error",
                "message": "JSearch API access denied (403). Subscribe to JSearch on RapidAPI (free tier available), then add JSEARCH_API_KEY to your backend .env. Get your key: https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch",
                "data": []
            }
        return {
            "status": "error",
            "message": f"Failed to fetch jobs: {msg}",
            "data": []
        }

def get_sample_jobs(query: str, location: str, employment_type: Optional[str] = None) -> List[Dict]:
    """Return sample job listings when real API is unavailable (e.g. 403 / no key)."""
    type_label = {
        "FULLTIME": "Full-time",
        "PARTTIME": "Part-time",
        "CONTRACTOR": "Contract",
        "INTERN": "Internship",
    }.get(employment_type or "FULLTIME", "Full-time")
    return [
        {
            "id": "sample-1",
            "title": f"Senior {query}",
            "company": "Tech Corp",
            "location": location,
            "type": type_label,
            "salary": "Not specified",
            "description": "Sample listing. Add JSEARCH_API_KEY and subscribe to JSearch on RapidAPI for real jobs.",
            "apply_link": "https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch",
            "source": "Sample",
            "logo": None,
            "is_remote": location.lower() == "remote",
        },
        {
            "id": "sample-2",
            "title": f"Junior {query}",
            "company": "StartUp Inc",
            "location": location,
            "type": type_label,
            "salary": "Not specified",
            "description": "Sample listing. Get your API key from RapidAPI to see real job listings here.",
            "apply_link": "https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch",
            "source": "Sample",
            "logo": None,
            "is_remote": False,
        },
    ]


def format_job_data(api_response: Dict) -> List[Dict]:
    """Format JSearch API response to match frontend expectations"""
    if api_response.get("status") == "error":
        return []
    
    jobs = api_response.get("data", [])
    formatted_jobs = []
    
    for job in jobs:
        # Determine job type
        job_type = job.get("job_employment_type", "FULLTIME")
        type_map = {
            "FULLTIME": "Full-time",
            "PARTTIME": "Part-time",
            "CONTRACTOR": "Contract",
            "INTERN": "Internship"
        }
        
        # Format salary
        salary_info = "Not specified"
        if job.get("job_min_salary") and job.get("job_max_salary"):
            min_sal = job.get("job_min_salary")
            max_sal = job.get("job_max_salary")
            currency = job.get("job_salary_currency", "USD")
            if currency == "INR":
                salary_info = f"₹{min_sal/100000:.1f}-{max_sal/100000:.1f} LPA"
            else:
                salary_info = f"${min_sal/1000:.0f}k-${max_sal/1000:.0f}k"
        
        # Get location
        location = "Remote" if job.get("job_is_remote") else (
            job.get("job_city") or job.get("job_state") or job.get("job_country") or "Not specified"
        )
        
        formatted_jobs.append({
            "id": job.get("job_id"),
            "title": job.get("job_title"),
            "company": job.get("employer_name"),
            "location": location,
            "type": type_map.get(job_type, job_type),
            "salary": salary_info,
            "description": (job.get("job_description") or "")[:200] + "..." if job.get("job_description") else "No description available",
            "apply_link": job.get("job_apply_link") or job.get("job_google_link"),
            "source": job.get("job_publisher", "Unknown"),
            "posted_at": job.get("job_posted_at_datetime_utc"),
            "logo": job.get("employer_logo"),
            "required_skills": job.get("job_required_skills", []),
            "is_remote": job.get("job_is_remote", False)
        })
    
    return formatted_jobs
