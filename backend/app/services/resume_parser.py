import io
import PyPDF2
import google.generativeai as genai
from app.core.config import settings
import json
import re

# Configure Gemini
api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
if api_key:
    genai.configure(api_key=api_key)
else:
    print("Warning: No Google/Gemini API key found in settings.")

model = genai.GenerativeModel('gemini-3-flash-preview')

def extract_text_from_pdf(file_bytes: bytes) -> str:
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        print(f"Error reading PDF: {e}")
        return ""

def parse_resume_with_llm(text: str) -> dict:
    if not text:
        print("CRITICAL: Received empty text for resume parsing.")
        return {"error": "Empty text"}

    print(f"--- AI PARSING START ---")
    print(f"Text Sample: {text[:200]}...")
    print(f"API Key present: {bool(settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY)}")

    prompt = f"""
    You are an expert ATS (Applicant Tracking System) parser. Extract the following details from the resume text below:
    - personal: {{ firstName, lastName, email, phone, summary }}
    - education: [{{ school, degree, field, year }}]
    - experience: [{{ company, role, start, end, description }}]
    - projects: [{{ title, techStack, description }}]
    - skills: [comprehensive list of technical skills, tools, and languages found across the entire resume, including those mentioned in experience or project descriptions]

    Return ONLY a valid JSON object. Keys must be exactly as shown above.
    Do not include markdown naming like ```json or ```.
    
    Resume Text:
    {text[:4000]}
    """
    
    try:
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # More robust JSON extraction: find the first { and the last }
        start_idx = content.find('{')
        end_idx = content.rfind('}')
        
        if start_idx != -1 and end_idx != -1:
            json_str = content[start_idx:end_idx+1]
            return json.loads(json_str)
        
        # Fallback to cleaning known markdown
        content = re.sub(r"```json", "", content)
        content = re.sub(r"```", "", content)
        return json.loads(content)
        
    except Exception as e:
        print(f"LLM Parsing Error: {e}")
        # Completely silent fallback - no 'Failed' labels
        return {
            "error": str(e),
            "personal": {"firstName": "", "lastName": "", "email": "", "phone": "", "summary": ""},
            "skills": [],
            "education": [],
            "experience": [],
            "projects": []
        }
