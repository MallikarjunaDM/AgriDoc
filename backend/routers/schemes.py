from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/api/schemes",
    tags=["schemes"]
)

class Scheme(BaseModel):
    id: int
    name: str
    hindi_name: str
    ministry: str
    description: str
    benefits: List[str]
    category: str
    link: str
    last_updated: str
    is_new: bool = False
    is_updated: bool = False

# Mock Database of Schemes
# In a real application, this might be fetched from a database or external API.
SCHEMES_DB = [
    {
        "id": 1,
        "name": "PM Kisan Samman Nidhi",
        "hindi_name": "प्रधानमंत्री किसान सम्मान निधि",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Income support of ₹6,000 per year in three equal installments to all land-holding farmer families.",
        "benefits": ["₹6000 per year per family", "Direct Bank Transfer", "No intermediaries"],
        "category": "Financial Assistance",
        "link": "https://pmkisan.gov.in",
        "last_updated": "2025-02-15",
        "is_updated": True
    },
    {
        "id": 2,
        "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "hindi_name": "प्रधानमंत्री फसल बीमा योजना",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Comprehensive crop insurance scheme to provide financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
        "benefits": ["Low premium rates", "Full sum insured coverage", "Post-harvest loss coverage"],
        "category": "Crop Insurance",
        "link": "https://pmfby.gov.in",
        "last_updated": "2025-01-20",
        "is_new": False
    },
    {
        "id": 3,
        "name": "Soil Health Card Scheme",
        "hindi_name": "मृदा स्वास्थ्य कार्ड योजना",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Government issues soil health cards to farmers which carries crop-wise recommendations of nutrients and fertilizers required for the individual farms.",
        "benefits": ["Soil testing every 3 years", "Fertilizer recommendations", "Improved Productivity"],
        "category": "Soil Health",
        "link": "https://soilhealth.dac.gov.in",
        "last_updated": "2024-12-10",
        "is_new": False
    },
    {
        "id": 4,
        "name": "Kisan Credit Card (KCC)",
        "hindi_name": "किसान क्रेडिट कार्ड",
        "ministry": "Ministry of Finance / NABARD",
        "description": "Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure.",
        "benefits": ["Credit for cultivation", "Post-harvest expenses", "Working capital for maintenance"],
        "category": "Credit & Loan",
        "link": "https://www.nabard.org/content1.aspx?id=1720&catid=23&mid=23",
        "last_updated": "2025-02-01",
        "is_updated": True
    },
    {
        "id": 5,
        "name": "e-NAM (National Agriculture Market)",
        "hindi_name": "राष्ट्रीय कृषि बाजार",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.",
        "benefits": ["Better price discovery", "Transparent auction process", "Real-time payments"],
        "category": "Market Support",
        "link": "https://enam.gov.in",
        "last_updated": "2025-02-10",
        "is_new": False
    },
    {
        "id": 6,
        "name": "Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)",
        "hindi_name": "प्रधानमंत्री कृषि सिंचाई योजना",
        "ministry": "Ministry of Jal Shakti",
        "description": "Har Khet Ko Pani - focused on expanding cultivated area under assured irrigation, improving on-farm water use efficiency.",
        "benefits": ["Micro Irrigation support", "Water harvesting structures", "More crop per drop"],
        "category": "Irrigation",
        "link": "https://pmksy.gov.in",
        "last_updated": "2024-11-05",
        "is_new": False
    },
    {
        "id": 7,
        "name": "Paramparagat Krishi Vikas Yojana (PKVY)",
        "hindi_name": "परम्परागत कृषि विकास योजना",
        "ministry": "Ministry of Agriculture & Farmers Welfare",
        "description": "Promotes organic farming through adoption of organic village by cluster approach and PGS certification.",
        "benefits": ["₹50,000 per hectare for 3 years", "Marketing support", "Organic certification assistance"],
        "category": "Organic Farming",
        "link": "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
        "last_updated": "2025-02-18",
        "is_new": True
    },
    {
        "id": 8,
        "name": " PM-KUSUM Scheme",
        "hindi_name": "प्रधानमंत्री कुसुम योजना",
        "ministry": "Ministry of New and Renewable Energy",
        "description": "Installation of solar pumps and grid-connected solar power plants for farmers.",
        "benefits": ["Subsidy on solar pumps", "Income from selling power", "Water security"],
        "category": "Technology & Energy",
        "link": "https://pmkusum.mnre.gov.in",
        "last_updated": "2025-01-15",
        "is_new": False
    }
]

@router.get("", response_model=List[Scheme])
async def get_schemes(
    category: Optional[str] = Query(None, description="Filter by category (e.g., 'Financial Assistance')"),
    search: Optional[str] = Query(None, description="Search by name or description")
):
    """
    Fetch government schemes with optional filtering and searching.
    """
    results = SCHEMES_DB
    
    if category and category != "All":
        results = [s for s in results if s["category"] == category]
        
    if search:
        search_lower = search.lower()
        results = [
            s for s in results 
            if search_lower in s["name"].lower() 
            or search_lower in s["hindi_name"].lower()
            or search_lower in s["description"].lower()
        ]
        
    return results

@router.get("/categories")
async def get_categories():
    """
    Get list of unique scheme categories.
    """
    categories = set(s["category"] for s in SCHEMES_DB)
    return sorted(list(categories))
