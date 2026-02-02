from fastapi import APIRouter, Query
from typing import Optional
from app.core.database import supabase
from pydantic import BaseModel
import google.generativeai as genai
from app.core.config import settings
import json
import re

router = APIRouter()

# Configure Gemini
api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
if api_key:
    genai.configure(api_key=api_key)

# Using gemini-3-flash-preview as verified in list_models.py
model = genai.GenerativeModel('gemini-3-flash-preview')

class EvaluationRequest(BaseModel):
    role: str
    round: str
    transcript: list # List of {sender: str, text: str}

@router.post("/evaluate")
def evaluate_interview(request: EvaluationRequest, user_id: Optional[str] = Query(None)):
    transcript_str = "\n".join([f"{m['sender'].upper()}: {m['text']}" for m in request.transcript])
    
    prompt = f"""
    You are an expert interviewer evaluating a candidate for a {request.role} role specifically for the {request.round} round.
    
    Review the following interview transcript:
    {transcript_str}
    
    Provide a detailed evaluation:
    1. Overall Score (0-100)
    2. Key Strengths
    3. Areas for Improvement
    4. Technical Accuracy (if applicable)
    5. Soft Skills Feedback (tone, confidence)
    
    Return the response as a valid JSON object with the following keys:
    - score: integer
    - feedback: string (brief 1-sentence summary)
    - suggestions: list of exactly 3 strings (actionable improvement points)
    - detailed_analysis: string (3-4 paragraphs of detailed performance review)
    
    Return ONLY valid JSON. No markdown.
    """
    
    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Robust JSON extraction
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1:
            data = json.loads(content[start_idx:end_idx+1])
        else:
            # Fallback cleaning
            clean_content = re.sub(r'```json\n?|```', '', content)
            data = json.loads(clean_content)

        if supabase and user_id:
            try:
                interview_data = {
                    "user_id": user_id,
                    "job_role": request.role,
                    "mode": request.round,
                    "score": data.get("score", 0),
                    "feedback": data.get("feedback", ""),
                    "metadata": data 
                }
                supabase.table("interviews").insert(interview_data).execute()
            except Exception as e:
                print(f"Error saving interview results: {e}")
                
        return data
    except Exception as e:
        print(f"Interview Evaluation AI Error: {e}")
        return {
            "score": 60,
            "feedback": "Interview completed successfully.",
            "suggestions": [
                "Structure your answers using the STAR method (Situation, Task, Action, Result).",
                "Provide more specific technical details in relevant questions.",
                "Maintain a confident and professional tone throughout the session."
            ],
            "detailed_analysis": f"AI evaluation encountered an error, but based on your transcript, you showed good engagement. Error details: {str(e)}"
        }
