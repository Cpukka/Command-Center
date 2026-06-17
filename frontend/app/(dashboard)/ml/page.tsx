'use client';

import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  Brain, 
  Play, 
  Trash2, 
  Eye, 
  Target,
  TrendingUp,
  Zap,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

interface MLModel {
  id: string;
  model_id?: string;
  name?: string;
  model_type?: string;
  accuracy?: number;
  status?: string;
  created_at?: string;
  dataset_id?: string;
}

export default function MLModelsPage() {
  const [models, setModels] = useState<MLModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTrainModal, setShowTrainModal] = useState(false);
  const [showPredictModal, setShowPredictModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState<MLModel | null>(null);
  const [training, setTraining] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<any>(null);
  const [predictionFeatures, setPredictionFeatures] = useState<Record<string, number>>({});
  const [trainConfig, setTrainConfig] = useState({
    datasetId: '',
    targetColumn: 'sales',
    modelType: 'regression',
    parameters: { n_estimators: 100, max_depth: 6 }
  });
  const [datasets, setDatasets] = useState<any[]>([]);

  useEffect(() => {
    loadModels();
    loadDatasets();
  }, []);

  const loadModels = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/models');
      const data = await response.json();
      const modelList = data.models || data || [];
      setModels(modelList);
    } catch (error) {
      console.error('Failed to load models:', error);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const loadDatasets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/datasets');
      const data = await response.json();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets:', error);
      setDatasets([]);
    }
  };

  const handleTrainModel = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trainConfig.datasetId) {
      toast.error('Please select a dataset');
      return;
    }
    
    if (!trainConfig.targetColumn) {
      toast.error('Please enter a target column');
      return;
    }
    
    setTraining(true);
    
    const requestBody = {
      dataset_id: trainConfig.datasetId,
      target_column: trainConfig.targetColumn,
      model_type: trainConfig.modelType,
      parameters: trainConfig.parameters
    };
    
    try {
      const response = await fetch('http://localhost:8000/api/train', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(data.message || 'Model training started!');
        setShowTrainModal(false);
        setTrainConfig({
          datasetId: '',
          targetColumn: 'sales',
          modelType: 'regression',
          parameters: { n_estimators: 100, max_depth: 6 }
        });
        setTimeout(() => loadModels(), 3000);
      } else {
        toast.error(data.detail || 'Training failed');
      }
    } catch (error) {
      toast.error('Failed to connect to AI service');
    } finally {
      setTraining(false);
    }
  };

  const openPredictModal = (model: MLModel) => {
    setSelectedModel(model);
    setPredictionResult(null);
    setPredictionFeatures({});
    setShowPredictModal(true);
  };

  const handlePredict = async () => {
    if (!selectedModel) return;
    
    if (Object.keys(predictionFeatures).length === 0) {
      toast.error('Please enter at least one feature value');
      return;
    }
    
    setPredicting(true);
    
    // Convert features to the format expected by the API
    const features = [predictionFeatures];
    
    const requestBody = {
      model_id: selectedModel.id || selectedModel.model_id,
      features: features
    };
    
    try {
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPredictionResult(data);
        toast.success('Prediction completed!');
      } else {
        toast.error(data.detail || 'Prediction failed');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to connect to AI service');
    } finally {
      setPredicting(false);
    }
  };

  const addFeatureField = () => {
    const newKey = `feature_${Object.keys(predictionFeatures).length + 1}`;
    setPredictionFeatures({ ...predictionFeatures, [newKey]: 0 });
  };

  const removeFeatureField = (key: string) => {
    const newFeatures = { ...predictionFeatures };
    delete newFeatures[key];
    setPredictionFeatures(newFeatures);
  };

  const updateFeatureValue = (key: string, value: number) => {
    setPredictionFeatures({ ...predictionFeatures, [key]: value });
  };

  const getModelId = (model: MLModel): string => {
    return model.id || model.model_id || 'unknown';
  };

  const getModelName = (model: MLModel): string => {
    if (model.name) return model.name;
    const id = getModelId(model);
    return id !== 'unknown' ? `Model ${id.slice(0, 8)}` : 'Unknown Model';
  };

  const getModelType = (model: MLModel): string => {
    return model.model_type || model.modelType || 'regression';
  };

  const getModelAccuracy = (model: MLModel): number => {
    return model.accuracy || 0;
  };

  const getCreatedAt = (model: MLModel): string => {
    return model.created_at || new Date().toISOString();
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 0.9) return 'text-green-500';
    if (accuracy >= 0.75) return 'text-yellow-500';
    return 'text-red-500';
  };

  const formatAccuracy = (accuracy: number) => {
    if (!accuracy && accuracy !== 0) return 'N/A';
    return `${Math.round(accuracy * 100)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 size={32} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">ML Models</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Train and manage machine learning models</p>
        </div>
        <button
          onClick={() => setShowTrainModal(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
        >
          <Brain size={16} />
          Train New Model
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Models</p>
              <p className="text-2xl font-bold">{models.length}</p>
            </div>
            <Brain size={24} className="text-purple-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Average Accuracy</p>
              <p className="text-2xl font-bold">
                {models.length > 0 
                  ? `${Math.round(models.reduce((acc, m) => acc + getModelAccuracy(m), 0) / models.length * 100)}%`
                  : 'N/A'}
              </p>
            </div>
            <Target size={24} className="text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready Models</p>
              <p className="text-2xl font-bold">{models.length}</p>
            </div>
            <Sparkles size={24} className="text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Models Grid */}
      {models.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
          <Brain size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Models Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Train your first machine learning model to get started</p>
          <button
            onClick={() => setShowTrainModal(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 inline-flex items-center gap-2"
          >
            <Brain size={16} />
            Train Your First Model
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model, index) => (
            <div key={getModelId(model) || index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Brain size={20} className="text-purple-500" />
                    <h3 className="font-semibold">{getModelName(model)}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                      <Eye size={16} />
                    </button>
                    <button className="p-1 hover:bg-red-100 rounded text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="capitalize font-medium">{getModelType(model)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                    <span className={`font-semibold ${getAccuracyColor(getModelAccuracy(model))}`}>
                      {formatAccuracy(getModelAccuracy(model))}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Created:</span>
                    <span>{new Date(getCreatedAt(model)).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => openPredictModal(model)}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 transition-colors"
                >
                  <Play size={14} />
                  Use for Prediction
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Train Modal */}
      {showTrainModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Train New Model</h2>
              <button onClick={() => setShowTrainModal(false)} className="p-1 hover:bg-gray-100 rounded">
                ✕
              </button>
            </div>
            <form onSubmit={handleTrainModel}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Dataset</label>
                <select
                  value={trainConfig.datasetId}
                  onChange={(e) => setTrainConfig({ ...trainConfig, datasetId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                  required
                >
                  <option value="">Select a dataset</option>
                  {datasets.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Model Type</label>
                <select
                  value={trainConfig.modelType}
                  onChange={(e) => setTrainConfig({ ...trainConfig, modelType: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                >
                  <option value="regression">Regression (Predict numbers)</option>
                  <option value="classification">Classification (Predict categories)</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Target Column</label>
                <input
                  type="text"
                  value={trainConfig.targetColumn}
                  onChange={(e) => setTrainConfig({ ...trainConfig, targetColumn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700"
                  placeholder="e.g., sales, price, category"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={training} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {training ? <Loader2 size={16} className="animate-spin" /> : <Brain size={16} />}
                  {training ? 'Training...' : 'Start Training'}
                </button>
                <button type="button" onClick={() => setShowTrainModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

{/* Prediction Modal */}
{showPredictModal && selectedModel && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Make Prediction</h2>
          <p className="text-sm text-gray-500 mt-1">Using model: {getModelName(selectedModel)}</p>
        </div>
        <button onClick={() => setShowPredictModal(false)} className="p-1 hover:bg-gray-100 rounded">
          ✕
        </button>
      </div>

      {/* Feature Inputs */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm font-medium">Input Features</label>
          <button
            type="button"
            onClick={addFeatureField}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Plus size={14} />
            Add Feature
          </button>
        </div>
        
        <div className="space-y-3">
          {Object.entries(predictionFeatures).map(([key, value], index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={key}
                onChange={(e) => {
                  const newFeatures = { ...predictionFeatures };
                  const oldValue = newFeatures[key];
                  delete newFeatures[key];
                  newFeatures[e.target.value] = oldValue;
                  setPredictionFeatures(newFeatures);
                }}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                placeholder="Feature name (e.g., age, salary)"
              />
              <input
                type="number"
                value={value}
                onChange={(e) => {
                  const newFeatures = { ...predictionFeatures };
                  newFeatures[key] = parseFloat(e.target.value) || 0;
                  setPredictionFeatures(newFeatures);
                }}
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                placeholder="Value"
                step="any"
              />
              <button
                onClick={() => {
                  const newFeatures = { ...predictionFeatures };
                  delete newFeatures[key];
                  setPredictionFeatures(newFeatures);
                }}
                className="p-2 text-red-500 hover:bg-red-100 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          
          {Object.keys(predictionFeatures).length === 0 && (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              <p>No features added. Click "Add Feature" to start.</p>
              <p className="text-sm mt-1">Add features like "age", "salary", "price", etc.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sample Feature Presets */}
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">Quick add sample features:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setPredictionFeatures({ ...predictionFeatures, age: 30 })}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
          >
            + age
          </button>
          <button
            onClick={() => setPredictionFeatures({ ...predictionFeatures, salary: 50000 })}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
          >
            + salary
          </button>
          <button
            onClick={() => setPredictionFeatures({ ...predictionFeatures, experience: 5 })}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
          >
            + experience
          </button>
          <button
            onClick={() => setPredictionFeatures({ ...predictionFeatures, sales: 1000 })}
            className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded hover:bg-gray-200"
          >
            + sales
          </button>
        </div>
      </div>

      {/* Prediction Result */}
      {predictionResult && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-green-600" />
            <h3 className="font-semibold text-green-700 dark:text-green-400">Prediction Result</h3>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {predictionResult.predictions?.[0]?.toFixed(2) || predictionResult.predictions?.[0] || 'N/A'}
            </p>
            {predictionResult.note && (
              <p className="text-xs text-gray-500 mt-2">{predictionResult.note}</p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={handlePredict}
          disabled={predicting || Object.keys(predictionFeatures).length === 0}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {predicting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {predicting ? 'Predicting...' : 'Generate Prediction'}
        </button>
        <button
          onClick={() => setShowPredictModal(false)}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Close
        </button>
      </div>

      {/* Help Text */}
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          💡 <span className="font-semibold">Tip:</span> Add features that match your dataset columns. 
          The model will use these values to generate a prediction. You can use the preset buttons above to quickly add common features.
        </p>
      </div>
    </div>
  </div>
)}

           
    </div>
  );
}