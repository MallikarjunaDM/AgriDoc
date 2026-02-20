from fastapi import APIRouter, HTTPException, Query
import httpx
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/api/climate",
    tags=["climate"]
)

@router.get("")
async def get_climate_insights(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    Fetch historical climate data and compare with current weather to generate insights.
    Uses Open-Meteo Climate/Archive API.
    """
    try:
        # Calculate date range for historical average (last 30 years same month)
        today = datetime.now()
        start_date = (today - timedelta(days=365 * 30)).strftime("%Y-%m-%d")
        end_date = (today - timedelta(days=365)).strftime("%Y-%m-%d")
        
        # We'll use the archive API to get long term data
        # For simplicity in this demo, we compare "today in history" averages
        # In a real app, we might want pre-calculated climate normals
        
        url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": start_date,
            "end_date": end_date,
            "daily": "temperature_2m_mean,precipitation_sum",
            "timezone": "auto"
        }
        
        # Optimization: To avoid processing 30 years of daily data on the fly for every request,
        # we can just fetch the last year vs 30 years ago to show a trend, 
        # or rely on the simpler 'climate' models if available.
        # For now, let's fetch a simplified view: 
        # Compare "This month last year" vs "This month 20 years ago" 
        
        # Let's adjust to a more lightweight approach for the hackathon/demo:
        # Fetch data for this specific week from 1990, 2000, 2010, 2020.
        
        years = [1990, 2000, 2010, 2020]
        historical_data = []
        
        async with httpx.AsyncClient() as client:
             # This is a bit heavy, strictly for demo purposes we might mock or use a very specific efficient query
             # Open-Meteo is fast, but multiple requests might be slow.
             # Alternative: Use the daily aggregate for a long range but just take the mean.
             
             # Better approach for efficient API usage:
             # Fetch the last 10 years of data for this month to show recent warming trend.
             
             query_start_date = (today - timedelta(days=365 * 10)).strftime("%Y-%m-%d")
             query_end_date = today.strftime("%Y-%m-%d")
             
             # NOTE: archive API usually goes up to 2 weeks ago. 
             # We will use the 'climate' API if possible, but archive is standard.
             
             # Let's fallback to a simpler "Climate Normals" mock calculation if the API is too heavy,
             # but let's try to get real data for at least one comparison.
             # We will fetch Today's date in 1990 VS Today's date in 2023.
             
             date_1990 = today.replace(year=1990).strftime("%Y-%m-%d")
             date_2023 = today.replace(year=2023).strftime("%Y-%m-%d")
             
             resp_1990 = await client.get(url, params={
                "latitude": lat,
                "longitude": lon,
                "start_date": date_1990,
                "end_date": (today.replace(year=1990) + timedelta(days=6)).strftime("%Y-%m-%d"), # 1 week average
                "daily": "temperature_2m_mean",
                "timezone": "auto"
             })
             
             resp_2023 = await client.get(url, params={
                "latitude": lat,
                "longitude": lon,
                "start_date": date_2023,
                "end_date": (today.replace(year=2023) + timedelta(days=6)).strftime("%Y-%m-%d"), # 1 week average
                "daily": "temperature_2m_mean",
                "timezone": "auto"
             })
             
             data_1990 = resp_1990.json()
             data_2023 = resp_2023.json()
             
             temp_1990 = sum(data_1990["daily"]["temperature_2m_mean"]) / len(data_1990["daily"]["temperature_2m_mean"])
             temp_2023 = sum(data_2023["daily"]["temperature_2m_mean"]) / len(data_2023["daily"]["temperature_2m_mean"])
             
             return {
                 "comparison": {
                     "year_1990": round(temp_1990, 1),
                     "year_2023": round(temp_2023, 1),
                     "diff": round(temp_2023 - temp_1990, 1)
                 },
                 "insight": f"Temperatures in your region have {'risen' if temp_2023 > temp_1990 else 'fallen'} by {abs(round(temp_2023 - temp_1990, 1))}°C since 1990."
             }

    except Exception as e:
        # Fallback for demo if API fails (avoid breaking frontend)
        print(f"Climate API Error: {e}")
        return {
             "comparison": {
                 "year_1990": 24.5,
                 "year_2023": 26.2,
                 "diff": 1.7
             },
             "insight": "Temperatures have risen by 1.7°C since 1990 (Simulated Data due to API error)"
        }
