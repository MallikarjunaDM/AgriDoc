from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])

class UserLogin(BaseModel):
    email: str
    password: str

class UserSignup(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str

@router.post("/signup")
async def signup(user: UserSignup):
    # Logic to create user in Supabase
    return {"message": "User created successfully", "user": user}

@router.post("/login")
async def login(user: UserLogin):
    # Logic to login user via Supabase
    return {"message": "Login successful", "token": "fake-jwt-token"}
