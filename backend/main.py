from fastapi import FastAPI
import os
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from .config import RESIM_KLASORU
from .database import tablolari_kur
from .routers import auth, patients, analysis, users, stats

app = FastAPI(title="AI Dental Diagnosis", version="1.1.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
os.makedirs(RESIM_KLASORU, exist_ok=True)
app.mount("/static", StaticFiles(directory=RESIM_KLASORU), name="static")

# Database Setup
tablolari_kur()

# Include Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(patients.router)
app.include_router(analysis.router)
app.include_router(stats.router)

@app.get("/")
def home():
    return {"message": "AI Dental Diagnosis API is running!"}
