from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_resume():
    return {"message": "Resume endpoint working"}
