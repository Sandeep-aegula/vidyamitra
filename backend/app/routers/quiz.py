from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_quiz():
    return {"message": "Quiz endpoint working"}
