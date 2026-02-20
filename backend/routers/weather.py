from fastapi import APIRouter, HTTPException, Query
import httpx

router = APIRouter(
    prefix="/api/weather",
    tags=["weather"]
)

@router.get("")
async def get_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """
    Fetch real-time weather data from Open-Meteo API.
    """
    try:
        url = "https://api.open-meteo.com/v1/forecast"
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum",
            "timezone": "auto"
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            response.raise_for_status()
            data = response.json()
            
            return {
                "current": {
                    "temperature": data["current"]["temperature_2m"],
                    "humidity": data["current"]["relative_humidity_2m"],
                    "precipitation": data["current"]["precipitation"],
                    "wind_speed": data["current"]["wind_speed_10m"],
                    "weather_code": data["current"]["weather_code"]
                },
                "daily": {
                    "max_temp": data["daily"]["temperature_2m_max"][0],
                    "min_temp": data["daily"]["temperature_2m_min"][0],
                    "total_precip" : data["daily"]["precipitation_sum"][0]
                },
                "units": data["current_units"]
            }
            
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="Weather service unavailable")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
