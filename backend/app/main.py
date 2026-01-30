from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, quiz, progress, evaluate, plan, interview, jobs, auth
from app.core.config import settings
import nltk

# Download NLTK data
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

app = FastAPI(title="VidyāMitra API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:5173", # React Frontend
    "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(evaluate.router, prefix="/evaluate", tags=["evaluate"])
app.include_router(plan.router, prefix="/plan", tags=["plan"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])

@app.get("/")
def root():
    return {"message": "Welcome to VidyāMitra API"}

@app.get("/health/ai")
async def health_ai():
    import google.generativeai as genai
    from app.core.config import settings
    api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
    if not api_key:
        return {"status": "error", "message": "No API key found"}
    
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-3-flash-preview')
        response = model.generate_content("ping")
        return {"status": "ok", "response": response.text}
    except Exception as e:
        return {"status": "error", "message": str(e)}
