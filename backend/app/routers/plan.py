from fastapi import APIRouter
from pydantic import BaseModel
import requests
from app.core.config import settings
from typing import List, Optional
from fastapi import APIRouter, Query
from app.core.database import supabase


router = APIRouter()

class PlanRequest(BaseModel):
    role: str
    skills_found: List[str]
    missing_skills: List[str]

import google.generativeai as genai
import json

# Configure Gemini
api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
if api_key:
    genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-3-flash-preview')

def search_youtube_videos(query: str, max_results: int = 1):
    if not settings.YOUTUBE_API_KEY:
        print("Warning: YouTube API Key missing. Returning search results link.")
        return [{
            "title": f"Tutorial for {query}",
            "url": "https://www.youtube.com/results?search_query=" + query.replace(' ', '+'),
            "thumbnail": "https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg",
            "channel": "YouTube Search"
        }]

    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query + " tutorial",
        "key": settings.YOUTUBE_API_KEY,
        "maxResults": max_results,
        "type": "video"
    }

    try:
        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        videos = []
        for item in data.get("items", []):
            videos.append({
                "title": item["snippet"]["title"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                "thumbnail": item["snippet"]["thumbnails"]["medium"]["url"],
                "channel": item["snippet"]["channelTitle"]
            })
        return videos
    except Exception as e:
        print(f"YouTube API Error: {e}")
        return []

def search_pexels_images(query: str, max_results: int = 1):
    if not settings.PEXELS_API_KEY:
        return []
        
    url = "https://api.pexels.com/v1/search"
    headers = {"Authorization": settings.PEXELS_API_KEY}
    params = {"query": query, "per_page": max_results}
    
    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        return [photo["src"]["medium"] for photo in data.get("photos", [])]
    except Exception as e:
        print(f"Pexels API Error: {e}")
        return []

@router.post("/")
def generate_plan(request: PlanRequest, user_id: Optional[str] = Query(None)):
    prompt = f"""
    You are a career coach. A user wants to become a {request.role}.
    They already know: {', '.join(request.skills_found)}.
    They are missing or need to improve: {', '.join(request.missing_skills)}.

    Generate a structured 4-week learning roadmap. 
    Each week should have:
    - week: (number 1-4)
    - focus: (main topic)
    - description: (brief overview)
    - search_query: (a specific YouTube search query for this topic)
    - tasks: (3-4 specific actionable items)
    - outcomes: (2-3 learning goals)

    Return ONLY a valid JSON object with the key "weeks" containing an array of 4 objects.
    Do not include markdown tags.
    """

    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Robust JSON extraction
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1:
            raw_plan = json.loads(content[start_idx:end_idx+1])
        else:
            raise ValueError("No JSON found in LLM response")

        # Enrich with YouTube links
        for week in raw_plan.get("weeks", []):
            query = week.get("search_query", week.get("focus", ""))
            week["videos"] = search_youtube_videos(query)

        if supabase and user_id:
            try:
                supabase.table("learning_plans").insert({
                    "user_id": user_id,
                    "plan_data": raw_plan,
                    "status": "in-progress"
                }).execute()
            except Exception as db_e:
                print(f"DB Error saving plan: {db_e}")

        return raw_plan
    except Exception as e:
        print(f"Plan Generation Error: {e}")
        # Final fallback template if AI fails
        return {
            "weeks": [
                {
                    "week": 1,
                    "focus": "Fundamentals",
                    "description": "Mastering the core concepts.",
                    "tasks": ["Study basics", "Complete exercises"],
                    "outcomes": ["Understand core principles"],
                    "videos": search_youtube_videos(request.role + " fundamentals")
                }
            ]
        }

@router.patch("/complete/{plan_id}")
def complete_module(plan_id: int, week_num: int, user_id: str):
    if not supabase:
        return {"error": "Database not connected"}
        
    try:
        # Fetch current plan
        res = supabase.table("learning_plans").select("*").eq("id", plan_id).eq("user_id", user_id).execute()
        if not res.data:
            return {"error": "Plan not found"}
            
        plan = res.data[0]
        weeks = plan["plan_data"]["weeks"]
        
        # Mark week as completed
        for week in weeks:
            if week["week"] == week_num:
                week["completed"] = True
                
        # Update back to DB
        supabase.table("learning_plans").update({"plan_data": plan["plan_data"]}).eq("id", plan_id).execute()
        
        # Check for badges (Course Crusader: 4 weeks completed)
        completed_weeks = [w for w in weeks if w.get("completed")]
        if len(completed_weeks) >= 4:
            # Award badge logic - if users table has badges col
            try:
                # Get current badges
                user_res = supabase.table("users").select("badges").eq("id", user_id).execute()
                if user_res.data:
                    badges = user_res.data[0].get("badges") or []
                    if "Course Crusader" not in badges:
                        badges.append("Course Crusader")
                        supabase.table("users").update({"badges": badges}).eq("id", user_id).execute()
            except Exception as badge_e:
                print(f"Error awarding badge: {badge_e}")
                
        return {"status": "ok", "completed_count": len(completed_weeks)}
    except Exception as e:
        print(f"Complete Module Error: {e}")
        return {"error": str(e)}
