from fastapi import APIRouter
from app.core.database import supabase
from typing import Optional

router = APIRouter()

import requests
from app.core.config import settings

@router.get("/{user_id}")
def get_user_progress(user_id: str):
    if not supabase:
        return {"error": "Database not connected"}

    try:
        # 1. Fetch Basic Stats
        plans = supabase.table("learning_plans").select("*").eq("user_id", user_id).execute()
        quizzes = supabase.table("quizzes").select("*").eq("user_id", user_id).execute()
        interviews = supabase.table("interviews").select("*").eq("user_id", user_id).execute()
        user_res = supabase.table("users").select("badges").eq("id", user_id).execute()
        
        # Calculate Aggregates
        completed_modules = 0
        if plans.data:
            for week in plans.data[0]["plan_data"].get("weeks", []):
                if week.get("completed"):
                    completed_modules += 1
        
        avg_quiz_score = 0
        if quizzes.data:
            avg_quiz_score = sum([q["score"] for q in quizzes.data]) / len(quizzes.data)
            
        badges = user_res.data[0].get("badges") if user_res.data else []

        # 2. Fetch Market Insights (News API)
        news_data = []
        if settings.NEWS_API_KEY:
            try:
                news_url = f"https://newsapi.org/v2/top-headlines?category=technology&language=en&apiKey={settings.NEWS_API_KEY}"
                n_res = requests.get(news_url)
                if n_res.status_code == 200:
                    news_data = n_res.json().get("articles", [])[:3]
            except Exception as e:
                print(f"News API error: {e}")

        # 3. Fetch Exchange Insights (Market value trend proxy)
        market_trend = {}
        if settings.EXCHANGE_API_KEY:
            try:
                # Using USD to INR as a sample market trend
                ex_url = f"https://v6.exchangerate-api.com/v6/{settings.EXCHANGE_API_KEY}/latest/USD"
                e_res = requests.get(ex_url)
                if e_res.status_code == 200:
                    market_trend = {
                        "base": "USD",
                        "rates": {
                            "INR": e_res.json().get("conversion_rates", {}).get("INR")
                        }
                    }
            except Exception as e:
                print(f"Exchange API error: {e}")

        return {
            "user_id": user_id,
            "stats": {
                "completed_modules": completed_modules,
                "average_quiz_score": round(avg_quiz_score, 1),
                "quizzes_taken": len(quizzes.data),
                "interviews_done": len(interviews.data),
                "badges": badges
            },
            "quiz_history": quizzes.data,
            "interview_history": interviews.data,
            "insights": {
                "news": news_data,
                "market": market_trend
            }
        }
    except Exception as e:
        print(f"Progress computation error: {e}")
        return {"error": str(e)}
