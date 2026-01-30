from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import resume, quiz, progress, evaluate, plan, interview, jobs

app = FastAPI(title="Vidyamitra API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
app.include_router(evaluate.router, prefix="/evaluate", tags=["evaluate"])
app.include_router(plan.router, prefix="/plan", tags=["plan"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])

@app.get("/")
def root():
    return {"name": "Vidyamitra API", "status": "ok"}
