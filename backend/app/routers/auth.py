from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from app.core.database import supabase
from app.core.config import settings
from passlib.context import CryptContext
import jwt
from datetime import datetime, timedelta
from typing import Optional

router = APIRouter()

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Utils
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    # Bcrypt has a 72-character limit. Truncate to avoid errors.
    return pwd_context.verify(plain_password[:72], hashed_password)

def get_password_hash(password):
    # Bcrypt has a 72-character limit. Truncate to avoid errors.
    return pwd_context.hash(password[:72])

# Models
class UserRegister(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_name: Optional[str] = None

def _auth_error_message(e: Exception) -> str:
    """Return a user-friendly message for auth/database errors."""
    msg = str(e).lower()
    if "already registered" in msg or "duplicate" in msg or "unique" in msg:
        return "Email or username already registered."
    if "relation" in msg or "does not exist" in msg or "users" in msg:
        return (
            "Database table 'users' is missing or not set up. "
            "In Supabase SQL Editor, create a table with columns: id (uuid, default gen_random_uuid()), email (text unique), username (text unique), full_name (text), password_hash (text), created_at (timestamptz default now())."
        )
    if "permission" in msg or "policy" in msg or "rls" in msg:
        return "Database permission denied. Ensure Row Level Security allows insert on the 'users' table."
    return "Registration failed. Please try again or contact support."


@router.post("/register", response_model=Token)
def register(user: UserRegister):
    full_name = f"{user.first_name} {user.last_name}"
    if not supabase:
         # Mock registration for dev without DB
         access_token = create_access_token(data={"sub": user.email, "id": "mock_id"})
         return {"access_token": access_token, "token_type": "bearer", "user_name": user.first_name}

    try:
        # Check email or username (query each separately to avoid .or_() escaping issues with @ in email)
        by_email = supabase.table("users").select("id").eq("email", user.email).execute()
        by_username = supabase.table("users").select("id").eq("username", user.username).execute()
        if (by_email.data and len(by_email.data) > 0) or (by_username.data and len(by_username.data) > 0):
            raise HTTPException(status_code=400, detail="Email or username already registered.")

        hashed_password = get_password_hash(user.password)
        new_user_data = {
            "email": user.email,
            "username": user.username,
            "full_name": full_name,
            "password_hash": hashed_password,
        }
        response = supabase.table("users").insert(new_user_data).execute()
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to create user.")
        user_record = response.data[0]
        access_token = create_access_token(data={"sub": user_record["email"], "id": user_record["id"]})
        return {"access_token": access_token, "token_type": "bearer", "user_name": user.first_name}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=_auth_error_message(e))

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    # Dummy login for testing
    if user.username_or_email == "aegulasandeep@gmail.com" and user.password == "237y1a66b0@0402":
        access_token = create_access_token(data={"sub": "aegulasandeep@gmail.com", "id": "dummy_id"})
        return {"access_token": access_token, "token_type": "bearer", "user_name": "Sandeep"}

    if not supabase:
        # Mock login for dev without DB
        if user.password == "password":
            return {"access_token": "mock_token", "token_type": "bearer", "user_name": "Sandeep"}
        raise HTTPException(status_code=400, detail="Incorrect username/email or password (Mock: use 'password')")

    try:
        # Find by email or username (two queries to avoid .or_() escaping with @)
        by_email = supabase.table("users").select("*").eq("email", user.username_or_email).execute()
        by_username = supabase.table("users").select("*").eq("username", user.username_or_email).execute()
        user_record = None
        if by_email.data and len(by_email.data) > 0:
            user_record = by_email.data[0]
        elif by_username.data and len(by_username.data) > 0:
            user_record = by_username.data[0]
        if not user_record:
            raise HTTPException(status_code=400, detail="Incorrect username/email or password.")
        if not verify_password(user.password, user_record.get("password_hash") or ""):
            raise HTTPException(status_code=400, detail="Incorrect username/email or password.")
        access_token = create_access_token(data={"sub": user_record["email"], "id": user_record["id"]})
        name = (user_record.get("full_name") or "").split(" ")[0] or "User"
        return {"access_token": access_token, "token_type": "bearer", "user_name": name}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=_auth_error_message(e))

@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest):
    # Mock logic for now
    return {"message": "If an account exists for this email, you will receive a password reset link shortly."}

@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest):
    # Mock logic for now
    return {"message": "Password has been reset successfully."}
