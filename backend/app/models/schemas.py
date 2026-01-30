from pydantic import BaseModel, EmailStr, Json
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID

# --- Shared Properties ---
class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str
    full_name: str

class User(UserBase):
    id: UUID
    created_at: datetime
    updated_at: Optional[datetime] = None
    last_login: Optional[datetime] = None
    profile_data: Optional[Dict[str, Any]] = {}

    class Config:
        from_attributes = True

# --- Resume ---
class ResumeBase(BaseModel):
    file_name: str
    parsed_content: Dict[str, Any]
    score: Optional[int] = None

class ResumeCreate(ResumeBase):
    user_id: UUID

class Resume(ResumeBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Skill Evaluation ---
class SkillEvaluationBase(BaseModel):
    job_role: str
    match_score: int
    strengths: List[str]
    gaps: List[str]

class SkillEvaluationCreate(SkillEvaluationBase):
    user_id: UUID

class SkillEvaluation(SkillEvaluationBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Learning Plan ---
class LearningPlanBase(BaseModel):
    plan_data: Dict[str, Any]
    status: str = "in-progress"

class LearningPlanCreate(LearningPlanBase):
    user_id: UUID

class LearningPlan(LearningPlanBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Quiz ---
class QuizBase(BaseModel):
    domain: str
    difficulty: str
    score: int
    total_questions: int

class QuizCreate(QuizBase):
    user_id: UUID

class Quiz(QuizBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- Interview ---
class InterviewBase(BaseModel):
    job_role: str
    mode: str
    score: int
    feedback: str

class InterviewCreate(InterviewBase):
    user_id: UUID

class Interview(InterviewBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True

# --- User Progress ---
class UserProgressBase(BaseModel):
    completed_activities: int = 0
    average_quiz_score: int = 0
    overall_profile_score: int = 0

class UserProgressCreate(UserProgressBase):
    user_id: UUID

class UserProgress(UserProgressBase):
    user_id: UUID
    last_updated: datetime

    class Config:
        from_attributes = True
