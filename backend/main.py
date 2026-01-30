from fastapi import FastAPI, UploadFile, File, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from auth import router as auth_router
from ml import evaluate_resume, generate_career_plan
from pydantic import BaseModel
from typing import List, Optional


app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")
# CORS setup
app.include_router(auth_router)

# User model
class User(BaseModel):
    username: str
    email: str
    full_name: Optional[str] = None

# Resume evaluation response
class ResumeEvaluation(BaseModel):
    score: float
    feedback: str

# Career plan response
class CareerPlan(BaseModel):
    recommended_roles: List[str]
    skills_to_improve: List[str]
    suggested_courses: List[str]

@app.post("/upload_resume", response_model=ResumeEvaluation)
async def upload_resume(file: UploadFile = File(...), token: str = Depends(oauth2_scheme)):
    file_bytes = await file.read()
    result = evaluate_resume(file_bytes)
    return ResumeEvaluation(**result)

@app.post("/career_plan", response_model=CareerPlan)
async def career_plan(user: User, token: str = Depends(oauth2_scheme)):
    result = generate_career_plan(user.dict())
    return CareerPlan(**result)

@app.get("/")
def read_root():
    return {"message": "VidyāMitra backend is running."}
