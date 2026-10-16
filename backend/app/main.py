import os
import sys
from pathlib import Path

# Ensure root directory is on sys.path so 'backend.app.*' imports resolve cleanly in any deployment
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.routes import router


# Load local environment variables
load_dotenv()

app = FastAPI(
    title="SwarSahayak API",
    description="Multilingual Voice-Based Digital Assistant for Rural and Tribal India",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS setup
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
async def root():
    return {
        "project": "SwarSahayak (स्वर सहायक)",
        "mission": "Multilingual Voice-Based Digital Assistant for Rural and Tribal India",
        "documentation": "/docs",
        "status": "online"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=True)
