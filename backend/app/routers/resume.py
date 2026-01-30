from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from fastapi.responses import Response
from app.services.resume_parser import extract_text_from_pdf, parse_resume_with_llm
from app.services.pdf_generator import generate_resume_pdf
from app.core.database import supabase
from typing import Optional

router = APIRouter()

@router.post("/parse")
async def parse_resume(file: UploadFile = File(...), user_id: Optional[str] = Query(None)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are supported")
    
    contents = await file.read()
    text = extract_text_from_pdf(contents)
    
    if not text:
         raise HTTPException(status_code=400, detail="Could not extract text from PDF")
         
    parsed_data = parse_resume_with_llm(text)
    
    if supabase and user_id:
        try:
            resume_data = {
                "user_id": user_id,
                "file_name": file.filename,
                "parsed_content": parsed_data,
                "score": 0 
            }
            supabase.table("resumes").insert(resume_data).execute()
        except Exception as e:
            print(f"Error saving resume: {e}")
    
    return parsed_data

@router.post("/generate")
async def generate_pdf(data: dict):
    try:
        pdf_bytes = generate_resume_pdf(data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=resume.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
