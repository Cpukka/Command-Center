import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error, accuracy_score
import joblib
import os
import json
from datetime import datetime
from typing import Dict, Any

MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)

# In-memory model registry (in production, use Redis)
model_registry = {}

async def train_model_task(request):
    """"Train XGBoost model"""
    try:
        # Generate sample data for demonstration
        # In production, fetch from PostgreSQL
        X, y = generate_sample_data(request.target_column)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        scaler = StandardScaler()
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        
        # Train XGBoost model
        if request.model_type == "regression":
            model = xgb.XGBRegressor(
                n_estimators=request.parameters.get('n_estimators', 100),
                max_depth=request.parameters.get('max_depth', 6),
                learning_rate=request.parameters.get('learning_rate', 0.1),
                random_state=42
            )
        else:
            model = xgb.XGBClassifier(
                n_estimators=request.parameters.get('n_estimators', 100),
                max_depth=request.parameters.get('max_depth', 6),
                learning_rate=request.parameters.get('learning_rate', 0.1),
                random_state=42
            )
        
        # Train
        model.fit(X_train_scaled, y_train)
        
        # Evaluate
        y_pred = model.predict(X_test_scaled)
        if request.model_type == "regression":
            score = np.sqrt(mean_squared_error(y_test, y_pred))
            metric_name = "rmse"
        else:
            score = accuracy_score(y_test, y_pred)
            metric_name = "accuracy"
        
        # Save model
        model_id = f"model_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        model_path = os.path.join(MODELS_DIR, f"{model_id}.joblib")
        joblib.dump({
            'model': model,
            'scaler': scaler,
            'features': [f"feature_{i}" for i in range(X.shape[1])]
        }, model_path)
        
        # Store in registry
        model_registry[model_id] = {
            'model_id': model_id,
            'model_type': request.model_type,
            'dataset_id': request.dataset_id,
            'target_column': request.target_column,
            metric_name: float(score),
            'created_at': datetime.now().isoformat(),
            'path': model_path
        }
        
        # Notify backend
        await notify_backend(model_id, score)
        
        return model_id
        
    except Exception as e:
        print(f"Training failed: {str(e)}")
        await notify_backend_failure(request.dataset_id, str(e))
        raise

def generate_sample_data(target_column, samples=1000):
    """"Generate sample data for demonstration"""
    np.random.seed(42)
    X = np.random.randn(samples, 10)
    y = 3 * X[:, 0] + 2 * X[:, 1] + np.random.randn(samples) * 0.5
    return X, y

async def list_models():
    """"List all trained models"""
    return [model_info for model_info in model_registry.values()]

async def get_model_info(model_id: str):
    """"Get model information"""
    return model_registry.get(model_id, {"error": "Model not found"})

async def notify_backend(model_id: str, score: float):
    """"Notify .NET backend about completed training"""
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                "http://localhost:5000/api/ml/callback",
                json={"model_id": model_id, "accuracy": score}
            )
    except:
        pass  # Backend notification is optional

async def notify_backend_failure(dataset_id: str, error: str):
    """"Notify backend about training failure"""
    import httpx
    try:
        async with httpx.AsyncClient() as client:
            await client.post(
                "http://localhost:5000/api/ml/failed",
                json={"dataset_id": dataset_id, "error": error}
            )
    except:
        pass
