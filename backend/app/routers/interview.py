from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_interview():
    return {"message": "Interview endpoint working"}
