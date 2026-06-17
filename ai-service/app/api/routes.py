from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
from app.services import training, prediction, forecasting

router = APIRouter()

class TrainRequest(BaseModel):
    dataset_id: str
    target_column: str
    model_type: str = "regression"  # regression, classification
    parameters: Dict[str, Any] = {}

class PredictRequest(BaseModel):
    model_id: str
    features: List[Dict[str, Any]]

class ForecastRequest(BaseModel):
    dataset_id: str
    target_column: str
    horizon: int = 30
    seasonality: int = 12

@router.post("/train")
async def train_model(request: TrainRequest, background_tasks: BackgroundTasks):
    """"Train an XGBoost model"""
    background_tasks.add_task(training.train_model_task, request)
    return {
        "status": "training_started",
        "dataset_id": request.dataset_id,
        "model_type": request.model_type,
        "message": "Model training started in background"
    }

@router.post("/predict")
async def predict(request: PredictRequest):
    """"Make predictions using trained model"""
    result = await prediction.predict_task(request.model_id, request.features)
    return result

@router.post("/forecast")
async def forecast(request: ForecastRequest):
    """"Generate time series forecast"""
    result = await forecasting.forecast_task(
        request.dataset_id,
        request.target_column,
        request.horizon,
        request.seasonality
    )
    return result

@router.get("/models")
async def list_models():
    """"List all trained models"""
    return {"models": await training.list_models()}

@router.get("/models/{model_id}")
async def get_model(model_id: str):
    """"Get model details"""
    return await training.get_model_info(model_id)
