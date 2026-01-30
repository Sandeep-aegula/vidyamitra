from fastapi import APIRouter, Query
from typing import Optional
from app.core.database import supabase

from pydantic import BaseModel
import google.generativeai as genai
from app.core.config import settings

router = APIRouter()

genai.configure(api_key=settings.GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-pro')

class InterviewRequest(BaseModel):
    role: str
    response: str
    previous_question: str

@router.post("/")
def mock_interview(request: InterviewRequest, user_id: Optional[str] = Query(None)):
    prompt = f"""
    You are an interviewer for a {request.role} position.
    The candidate was asked: "{request.previous_question}"
    The candidate replied: "{request.response}"
    
    Provide feedback on the candidate's answer (tone, accuracy) and ask the next follow-up question.
    Return JSON with:
    - feedback
    - next_question
    
    Return ONLY valid JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        content = response.text
        
        if supabase and user_id:
            try:
                # Save just the feedback/score for this turn
                interview_data = {
                    "user_id": user_id,
                    "job_role": request.role,
                    "mode": "Text", # Defaulting to text for now
                    "score": 0, # Placeholder, could parse from LLM
                    "feedback": content # Storing the full LLM response as feedback
                }
                supabase.table("interviews").insert(interview_data).execute()
            except Exception as e:
                print(f"Error saving interview: {e}")

        # Returning raw text if JSON parsing fails isn't ideal but keeps it robust for now
        # Ideally we parse it similar to others
        return {"response": content} 
    except Exception as e:
        return {"error": str(e)}
