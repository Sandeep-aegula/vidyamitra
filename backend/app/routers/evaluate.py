from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def get_evaluate():
    return {"message": "Evaluate endpoint working"}
