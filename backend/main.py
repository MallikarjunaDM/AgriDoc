from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Agriculture Doctor API",
    description="Backend API for Agriculture Doctor Platform",
    version="1.0.0"
)

# CORS Middleware
# Allow the production frontend URL (set via env var) + localhost for dev
_frontend_url = os.getenv("FRONTEND_URL", "")
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]
if _frontend_url:
    origins.append(_frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import auth, doctor, disease, collective, market, weather, climate, schemes, advisor

# Include Routers
app.include_router(auth.router)
app.include_router(doctor.router)
app.include_router(disease.router)
app.include_router(collective.router)
app.include_router(market.router)
app.include_router(weather.router)
app.include_router(climate.router)
app.include_router(schemes.router)
app.include_router(advisor.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Agriculture Doctor API"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
