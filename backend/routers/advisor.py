import os
import json
import google.generativeai as genai
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/advisor", tags=["advisor"])

# Configure Gemini
api_key = os.getenv("GEMINI_DOCTOR_KEY")
if not api_key:
    print("WARNING: GEMINI_DOCTOR_KEY not found")
else:
    genai.configure(api_key=api_key)

model = genai.GenerativeModel('gemini-2.5-flash')

SYSTEM_PROMPT = """You are Agriculture Doctor's Farming Practice Advisor. 
A farmer wants to learn about a new farming practice.

Your job is to return a strict JSON implementation plan.

JSON Schema:
{
  "practice_name": "String",
  "one_liner": "String",
  "why_it_works": "String",
  "compatibility": "High" | "Medium" | "Low",
  "compatibility_reason": "String",
  "estimated_cost": { "min": Number, "max": Number, "unit": "String" },
  "time_to_see_results": "String",
  "phases": [
    {
      "phase": Number,
      "title": "String",
      "duration": "String",
      "steps": ["String"],
      "cost_this_phase": "String",
      "what_you_need": ["String"]
    }
  ],
  "common_mistakes": ["String"],
  "government_schemes": ["String"],
  "youtube_search": "String"
}

Rules:
1. Use simple English suitable for Indian farmers.
2. Costs must be in INR (₹).
3. Mention real Indian government schemes (PM-KISAN, etc).
4. Do not include markdown formatting (```json), just raw JSON.
"""

class PlanRequest(BaseModel):
    practice_name: str
    farmer_profile: Optional[Dict] = {}

@router.post("/plan")
async def generate_plan(request: PlanRequest):
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API Key missing")

    try:
        profile_text = ", ".join([f"{k}: {v}" for k, v in request.farmer_profile.items() if v])
        prompt = f"{SYSTEM_PROMPT}\n\nFarmer Profile: {profile_text}\nPractice: {request.practice_name}\n\nReturn JSON:"

        response = model.generate_content(prompt)
        text = response.text.strip()
        
        # Clean markdown if present
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
            
        return json.loads(text)

    except Exception as e:
        print(f"Advisor Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
