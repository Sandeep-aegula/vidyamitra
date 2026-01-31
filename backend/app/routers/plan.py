from fastapi import APIRouter
from pydantic import BaseModel
import requests
from app.core.config import settings
from typing import List, Optional
from fastapi import APIRouter, Query
from app.core.database import supabase
from datetime import datetime


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
    # Use missing_skills as the top 4 topics for the learning plan
    top_topics = request.missing_skills[:4] if len(request.missing_skills) >= 4 else request.missing_skills
    
    # Ensure we have exactly 4 topics
    while len(top_topics) < 4:
        top_topics.append(f"{request.role} Fundamentals")
    
    prompt = f"""
    You are a career coach. A user wants to become a {request.role}.
    They already know: {', '.join(request.skills_found)}.
    They need to learn these 4 topics (in priority order): {', '.join(top_topics)}.

    Generate a structured 4-week learning roadmap where EACH WEEK focuses on ONE of the 4 topics above, in order.
    
    For each week:
    - week: (number 1-4)
    - focus: (use the exact topic name from the list above)
    - description: (brief overview of what they'll learn this week)
    - search_query: (a specific YouTube search query for this topic, e.g. "React tutorial for beginners 2024")
    - tasks: (3-4 specific actionable items to complete)
    - outcomes: (2-3 learning goals they'll achieve)
    - difficulty_level: (Easy, Medium, or Hard based on topic complexity)

    Return ONLY a valid JSON object with the key "weeks" containing an array of exactly 4 objects.
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

        # Enrich with YouTube links (2-3 videos per topic)
        for week in raw_plan.get("weeks", []):
            query = week.get("search_query", week.get("focus", ""))
            week["videos"] = search_youtube_videos(query, max_results=2)
            week["completed"] = False  # Initialize completion status

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

@router.post("/complete-week")
def complete_week(week_number: int, topic: str, user_id: Optional[str] = Query(None)):
    """Mark a specific week as completed and indicate quiz readiness"""
    
    # For now, return success without database dependency
    # In production, this would update the learning_plans table
    
    if supabase and user_id:
        try:
            # Fetch current plan
            res = supabase.table("learning_plans").select("*").eq("user_id", user_id).order("created_at", desc=True).limit(1).execute()
            if res.data:
                plan = res.data[0]
                weeks = plan["plan_data"].get("weeks", [])
                
                # Mark week as completed
                for week in weeks:
                    if week["week"] == week_number:
                        week["completed"] = True
                        week["completed_at"] = str(datetime.now())
                        
                # Update back to DB
                supabase.table("learning_plans").update({"plan_data": plan["plan_data"]}).eq("id", plan["id"]).execute()
                
                # Count completed weeks
                completed_count = sum(1 for w in weeks if w.get("completed"))
                
                return {
                    "success": True,
                    "completed_weeks": completed_count,
                    "quiz_ready": True,
                    "topic": topic,
                    "message": f"Week {week_number} completed! Ready for quiz on {topic}"
                }
        except Exception as e:
            print(f"Complete Week Error: {e}")
    
    # Fallback response when DB is not available
    return {
        "success": True,
        "completed_weeks": week_number,
        "quiz_ready": True,
        "topic": topic,
        "message": f"Week {week_number} completed! Ready for quiz on {topic}"
    }

