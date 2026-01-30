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
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

# Models
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

@router.post("/register", response_model=Token)
def register(user: UserRegister):
    if not supabase:
         # Mock registration for dev without DB
         access_token = create_access_token(data={"sub": user.email, "id": "mock_id"})
         return {"access_token": access_token, "token_type": "bearer"}

    # Check if user exists
    try:
        existing_user = supabase.table("users").select("*").eq("email", user.email).execute()
        if existing_user.data:
            raise HTTPException(status_code=400, detail="Email already registered")

        hashed_password = get_password_hash(user.password)
        
        # Store in Supabase
        new_user_data = {
            "email": user.email,
            "full_name": user.full_name,
            "password_hash": hashed_password
        }
    
        response = supabase.table("users").insert(new_user_data).execute()
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to create user")
        
        user_record = response.data[0]
        access_token = create_access_token(data={"sub": user_record['email'], "id": user_record['id']})
        return {"access_token": access_token, "token_type": "bearer"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/login", response_model=Token)
def login(user: UserLogin):
    if not supabase:
        # Mock login for dev without DB
        if user.password == "password": # Simple check
            access_token = create_access_token(data={"sub": user.email, "id": "mock_id"})
            return {"access_token": access_token, "token_type": "bearer"}
        else:
             raise HTTPException(status_code=400, detail="Incorrect email or password (Mock: use 'password')")

    try:
        response = supabase.table("users").select("*").eq("email", user.email).execute()
        if not response.data:
            raise HTTPException(status_code=400, detail="Incorrect email or password")
        
        user_record = response.data[0]
        if not verify_password(user.password, user_record['password_hash']):
            raise HTTPException(status_code=400, detail="Incorrect email or password")

        access_token = create_access_token(data={"sub": user_record['email'], "id": user_record['id']})
        return {"access_token": access_token, "token_type": "bearer"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
