import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/doctor", tags=["doctor"])

# Configure Gemini
api_key = os.getenv("GEMINI_DOCTOR_KEY")
if not api_key:
    print("WARNING: GEMINI_DOCTOR_KEY not found in environment variables")
else:
    genai.configure(api_key=api_key)

# Initialize Model
model = genai.GenerativeModel('gemini-2.5-flash')

SYSTEM_PROMPT = """You are an expert Agricultural Doctor AI chatbot assisting Indian farmers.
You diagnose crop diseases, suggest treatments, and provide farming advice.
Be friendly, concise, and helpful. Use simple language that farmers can understand.
If a farmer describes symptoms, provide:
1. A likely diagnosis
2. Recommended treatment steps
3. Prevention tips
If you need more information (like a photo or more details), ask for it politely.
Always prioritize practical, actionable advice."""


class DiagnoseRequest(BaseModel):
    message: str
    crop_type: Optional[str] = None
    location: Optional[str] = None
    image_url: Optional[str] = None
    image_base64: Optional[str] = None
    chat_history: List[dict] = []
    language: Optional[str] = "en"
    language_name: Optional[str] = "English"


@router.post("/diagnose")
async def diagnose(request: DiagnoseRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="Server misconfigured: Missing Gemini API Key")

    try:
        lang_name = request.language_name or "English"

        full_context_prompt = SYSTEM_PROMPT
        full_context_prompt += f"\n\nIMPORTANT: You MUST respond ONLY in {lang_name}. Do not use any other language.\n\n"

        if request.crop_type:
            full_context_prompt += f"Crop: {request.crop_type}\n"
        if request.location:
            full_context_prompt += f"Location: {request.location}\n"

        if request.image_base64:
            full_context_prompt += "\n[Note: The farmer has attached a photo of their crop for diagnosis.]\n"

        full_context_prompt += "\nChat History:\n"
        for msg in request.chat_history:
            role = "Farmer" if msg.get("role") == "user" else "AI Doctor"
            full_context_prompt += f"{role}: {msg.get('content', '')}\n"

        full_context_prompt += f"\nFarmer: {request.message}\nAI Doctor:"

        # Generate response
        response = model.generate_content(full_context_prompt)
        reply = response.text

        return {
            "diagnosis": reply,
            "confidence": "High",
            "treatment": [],
            "prevention": []
        }

    except Exception as e:
        print(f"Gemini Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
