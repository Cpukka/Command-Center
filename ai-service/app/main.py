from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import routes
import uvicorn

app = FastAPI(
    title="Command Center AI/ML Service",
    description="Machine Learning and Forecasting Service with XGBoost",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routes
app.include_router(routes.router, prefix="/api")

@app.get("/")
async def root():
    return {
        "service": "Command Center AI/ML Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": [
            "/api/health",
            "/api/train",
            "/api/predict",
            "/api/forecast"
        ]
    }

@app.get("/api/health")
async def health():
    return {"status": "healthy", "service": "ai-ml", "framework": "XGBoost"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
