from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.database import supabase
from app.models.schemas import QuizCreate
import google.generativeai as genai
from app.core.config import settings
import json
import re

router = APIRouter()

# Reuse configuration if possible, or re-configure safely
api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
if api_key:
    genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-3-flash-preview')

class QuizRequest(BaseModel):
    topic: str
    difficulty: str = "Medium"
    count: int = 5

@router.post("/")
def generate_quiz(request: QuizRequest):
    prompt = f"""
    Generate {request.count} {request.difficulty} multiple-choice questions about {request.topic}.
    Each question must be challenging and relevant.
    Return a valid JSON object with a key "questions" containing an array of objects.
    Each object must have:
    - id: (unique number)
    - question: (string)
    - options: (list of 4 strings)
    - correct: (the exact correct option string)
    - explanation: (brief reason why it is correct)
    
    Return ONLY valid JSON. Do not include markdown naming like ```json.
    """
    
    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Robust JSON extraction
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1:
            json_str = content[start_idx:end_idx+1]
            data = json.loads(json_str)
            return data
        
        content = re.sub(r"```json", "", content)
        content = re.sub(r"```", "", content)
        return json.loads(content)
    except Exception as e:
        print(f"Quiz Generation Error: {e}")
        return {"error": str(e)}

@router.post("/submit")
def submit_quiz(quiz_result: QuizCreate):
    if not supabase:
         raise HTTPException(status_code=503, detail="Database unavailable")

    try:
        # data = quiz_result.model_dump() # Pydantic v2
        data = quiz_result.dict()
        data['user_id'] = str(data['user_id'])
        
        response = supabase.table("quizzes").insert(data).execute()
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
