from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import List, Optional
from app.core.database import supabase
import google.generativeai as genai
from app.core.config import settings
import json
import re

# Configure Gemini
api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
if api_key:
    genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-3-flash-preview')

router = APIRouter()

class EvaluationRequest(BaseModel):
    resume_skills: List[str]
    job_description: str
    job_role: Optional[str] = "General"
    personal_info: Optional[dict] = None

@router.post("/")
def evaluate_skills(request: EvaluationRequest, user_id: Optional[str] = Query(None)):
    if not request.resume_skills:
        # If no skills are detected, the score is naturally low, but we provide guidance
        return {
            "score": 10,
            "match_score": 10,
            "matched_skills": [],
            "missing_skills": ["No technical skills were detected on your resume. Please add them for a better analysis."],
            "personal_info": request.personal_info,
            "job_role": request.job_role
        }

    prompt = f"""
    You are a professional hiring manager. Evaluate the following resume skills against the target job role and description.
    Target Job Role: {request.job_role}
    Job Description: {request.job_description}
    Resume Skills: {", ".join(request.resume_skills)}

    Tasks:
    1. Calculate a match_score (0-100) based on how well the candidate's skills align with the role. Be fair but encouraging.
    2. Identify matched_skills: list of skills from the resume that are directly or semantically relevant to the job.
    3. Identify missing_skills: list of EXACTLY 4 critical skills/tools mentioned in the job description that are missing from the resume. 
       Prioritize these by importance for the role. If fewer than 4 are missing, suggest related skills that would strengthen the profile.

    Return ONLY a JSON object with this structure:
    {{
      "match_score": integer,
      "matched_skills": [string],
      "missing_skills": [exactly 4 strings, ordered by importance]
    }}
    
    Return ONLY valid JSON.
    """
    
    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Robust JSON extraction
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        if start_idx != -1 and end_idx != -1:
            eval_results = json.loads(content[start_idx:end_idx+1])
        else:
            raise ValueError("No JSON found in LLM response")
            
        score = eval_results.get("match_score", 0)
        matched_skills = eval_results.get("matched_skills", [])
        missing_skills = eval_results.get("missing_skills", [])
        
        # Ensure exactly 4 missing skills
        if len(missing_skills) > 4:
            missing_skills = missing_skills[:4]
        elif len(missing_skills) < 4:
            # Pad with generic suggestions if needed
            generic_skills = ["Problem Solving", "Communication", "Time Management", "Teamwork"]
            while len(missing_skills) < 4 and generic_skills:
                skill = generic_skills.pop(0)
                if skill not in missing_skills:
                    missing_skills.append(skill)
        
    except Exception as e:
        print(f"Evaluation AI Error: {e}")
        # Improved Fallback: fuzzy/substring matching
        job_desc_lower = request.job_description.lower()
        matched_skills = []
        for skill in request.resume_skills:
            if skill.lower() in job_desc_lower or any(word in job_desc_lower for word in skill.lower().split()):
                matched_skills.append(skill)
        
        # Base score on matches, but at least 20 if they have skills
        score = (len(matched_skills) / len(request.resume_skills)) * 100 if request.resume_skills else 0
        score = max(score, 20) if request.resume_skills else 0
        missing_skills = ["Communication", "Problem Solving", "Technical Documentation", "Collaboration"]

    score = round(score, 2)
    
    # Store in database if possible
    if supabase and user_id:
        try:
            eval_data = {
                "user_id": user_id,
                "job_role": request.job_role,
                "match_score": int(score),
                "strengths": matched_skills,
                "gaps": missing_skills
            }
            supabase.table("skill_evaluations").insert(eval_data).execute()
        except Exception as e:
            print(f"Error saving evaluation: {e}")

    # Return comprehensive result with top 4 topics for learning plan
    return {
        "score": score,
        "match_score": score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "top_topics": missing_skills[:4],  # Explicitly provide top 4 for learning plan
        "personal_info": request.personal_info,
        "job_role": request.job_role
    }
