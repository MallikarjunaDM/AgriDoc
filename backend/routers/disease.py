import os
import base64
import requests
from fastapi import APIRouter, UploadFile, File, HTTPException
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/api/disease", tags=["disease"])

PLANT_ID_API_KEY = os.getenv("PLANT_ID_API_KEY")
PLANT_ID_URL = "https://api.plant.id/v2/health_assessment"

@router.post("/detect")
async def detect_disease(file: UploadFile = File(...)):
    if not PLANT_ID_API_KEY:
        raise HTTPException(status_code=500, detail="Server misconfigured: Missing Plant.id API Key")

    try:
        # Read file content
        contents = await file.read()
        encoded_image = base64.b64encode(contents).decode("utf-8")

        headers = {
            "Content-Type": "application/json",
            "Api-Key": PLANT_ID_API_KEY,
        }

        data = {
            "images": [encoded_image],
            "modifiers": ["similar_images"],
            "disease_details": ["description", "treatment", "cause"],
        }

        response = requests.post(PLANT_ID_URL, json=data, headers=headers)
        
        if response.status_code != 200:
            print(f"Plant.id Error: {response.text}")
            raise HTTPException(status_code=response.status_code, detail="Failed to analyze image with Plant.id")

        result = response.json()
        
        # Extract most likely disease
        if not result.get("health_assessment", {}).get("diseases"):
             return {
                "disease": "Healthy",
                "confidence": 0.99,
                "treatment": "Keep up the good work!",
                "prevention": []
            }
            
        top_match = result["health_assessment"]["diseases"][0]
        
        disease_name = top_match.get("name", "Unknown Issue")
        confidence = top_match.get("probability", 0)
        
        # Extract treatment info if available
        details = top_match.get("disease_details", {})
        treatment_desc = details.get("treatment", {}).get("biological", []) + details.get("treatment", {}).get("chemical", [])
        
        treatment_str = " ".join(treatment_desc[:2]) if treatment_desc else "Consult an expert."

        return {
            "disease": disease_name,
            "confidence": round(confidence, 2),
            "treatment": treatment_str,
            "raw_data": top_match # Include raw for debugging
        }

    except Exception as e:
        print(f"Detection Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
