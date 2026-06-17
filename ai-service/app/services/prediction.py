import numpy as np
import joblib
import os
from typing import List, Dict, Any
from .training import model_registry, MODELS_DIR

async def predict_task(model_id: str, features: List[Dict[str, Any]]):
    """Make predictions using trained model (with demo fallback)"""
    
    print(f"Prediction request - Model: {model_id}, Features: {features}")
    
    try:
        # Try to load model
        model_data = None
        
        if model_id in model_registry:
            model_data = model_registry[model_id]
        else:
            model_path = os.path.join(MODELS_DIR, f"{model_id}.joblib")
            if os.path.exists(model_path):
                model_data = joblib.load(model_path)
                model_registry[model_id] = model_data
                print(f"Loaded model from {model_path}")
        
        # If model exists, use it
        if model_data:
            if isinstance(model_data, dict):
                model = model_data.get('model')
                scaler = model_data.get('scaler')
                feature_names = model_data.get('features')
            else:
                model = model_data
                scaler = None
                feature_names = None
            
            # Prepare features
            import pandas as pd
            X = pd.DataFrame(features)
            
            # Ensure correct columns
            if feature_names:
                for col in feature_names:
                    if col not in X.columns:
                        X[col] = 0
                X = X[feature_names]
            
            # Scale if scaler exists
            if scaler:
                X_scaled = scaler.transform(X)
            else:
                X_scaled = X.values
            
            # Predict
            predictions = model.predict(X_scaled)
            
            return {
                "model_id": model_id,
                "predictions": predictions.tolist(),
                "count": len(predictions),
                "model_type": "trained"
            }
        else:
            # Demo mode - generate realistic predictions based on features
            return await demo_prediction(model_id, features)
            
    except Exception as e:
        print(f"Prediction error: {e}")
        # Fall back to demo prediction
        return await demo_prediction(model_id, features)

async def demo_prediction(model_id: str, features: List[Dict[str, Any]]):
    """Generate demo predictions when no trained model is available"""
    
    predictions = []
    for feature_dict in features:
        if feature_dict:
            # Calculate a meaningful prediction based on input features
            values = list(feature_dict.values())
            # Simple weighted sum for demo
            prediction = sum(values) / len(values) * 1.5
            # Add some variation
            prediction = prediction + np.random.randn() * 5
        else:
            prediction = 75.0  # Default prediction
        
        # Ensure prediction is positive and reasonable
        prediction = max(0, min(500, prediction))
        predictions.append(round(prediction, 2))
    
    return {
        "model_id": model_id,
        "predictions": predictions,
        "count": len(predictions),
        "note": "Demo mode - Train a model with your data for accurate predictions",
        "demo": True
    }