# VidyāMitra Backend API Documentation

## Authentication
- **POST /token**: Get JWT token (OAuth2)
  - Body: `username`, `password` (form)
  - Response: `{ access_token, token_type }`

## Resume Evaluation
- **POST /upload_resume**
  - Headers: `Authorization: Bearer <token>`
  - Body: `file` (form-data, resume file)
  - Response: `{ score, feedback }`

## Career Planning
- **POST /career_plan**
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ username, email, full_name }`
  - Response: `{ recommended_roles, skills_to_improve, suggested_courses }`

## Health Check
- **GET /**
  - Response: `{ message }`

---

All endpoints require authentication except `/` and `/token`.
