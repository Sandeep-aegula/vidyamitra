from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_plan():
    return {"message": "Plan endpoint working"}
