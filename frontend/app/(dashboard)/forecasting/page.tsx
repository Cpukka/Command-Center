// app/forecasting/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Download, 
  Loader2
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from 'recharts';
import toast from 'react-hot-toast';

export default function ForecastingPage() {
  const [forecastConfig, setForecastConfig] = useState({
    datasetId: '',
    targetColumn: 'sales',
    horizon: 30,
    seasonality: 12
  });
  const [forecastResult, setForecastResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [datasets, setDatasets] = useState<any[]>([]);

  const loadDatasets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/datasets');
      const data = await response.json();
      setDatasets(data);
    } catch (error) {
      console.error('Failed to load datasets:', error);
      toast.error('Failed to load datasets');
    }
  };

  const generateForecast = async () => {
    if (!forecastConfig.datasetId) {
      toast.error('Please select a dataset');
      return;
    }
    
    if (!forecastConfig.targetColumn) {
      toast.error('Please enter a target column');
      return;
    }
    
    setLoading(true);
    
    const requestBody = {
      dataset_id: forecastConfig.datasetId,
      target_column: forecastConfig.targetColumn,
      horizon: forecastConfig.horizon,
      seasonality: forecastConfig.seasonality
    };
    
    console.log('Sending forecast request:', requestBody);
    
    try {
      const response = await fetch('http://localhost:8000/api/forecast', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
      
      const data = await response.json();
      console.log('Forecast response:', data);
      
      if (response.ok) {
        setForecastResult(data);
        toast.success('Forecast generated successfully');
      } else {
        toast.error(data.detail || data.message || 'Failed to generate forecast');
      }
    } catch (error) {
      console.error('Failed to generate forecast:', error);
      toast.error('Failed to connect to AI service. Make sure it\'s running on port 8000');
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    if (!forecastResult || !forecastResult.forecasts) return;
    
    const headers = ['Date', 'Forecast Value', 'Lower Bound', 'Upper Bound'];
    const csvData = forecastResult.forecasts.map((f: any) => [
      f.date,
      f.value,
      f.lowerBound,
      f.upperBound
    ]);
    
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `forecast_${new Date().toISOString()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Forecast exported to CSV');
  };

  useEffect(() => {
    loadDatasets();
  }, []);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Time Series Forecasting</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Generate predictions for future time periods</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} />
              Forecast Configuration
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Dataset</label>
                <select
                  value={forecastConfig.datasetId}
                  onChange={(e) => setForecastConfig({ ...forecastConfig, datasetId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="">Choose a dataset...</option>
                  {datasets.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Target Column</label>
                <input
                  type="text"
                  value={forecastConfig.targetColumn}
                  onChange={(e) => setForecastConfig({ ...forecastConfig, targetColumn: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="e.g., sales, revenue, users"
                />
                <p className="text-xs text-gray-500 mt-1">The column you want to forecast</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Forecast Horizon (days)</label>
                <input
                  type="range"
                  min="7"
                  max="365"
                  value={forecastConfig.horizon}
                  onChange={(e) => setForecastConfig({ ...forecastConfig, horizon: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="text-center mt-1 text-sm font-semibold">{forecastConfig.horizon} days</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Seasonality Period</label>
                <select
                  value={forecastConfig.seasonality}
                  onChange={(e) => setForecastConfig({ ...forecastConfig, seasonality: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="7">Weekly (7 days)</option>
                  <option value="30">Monthly (30 days)</option>
                  <option value="90">Quarterly (90 days)</option>
                  <option value="365">Yearly (365 days)</option>
                </select>
              </div>
              
              <button
                onClick={generateForecast}
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <TrendingUp size={16} />}
                {loading ? 'Generating...' : 'Generate Forecast'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2">
          {forecastResult ? (
            <div className="space-y-6">
              {/* Export Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-1 text-sm"
                >
                  <Download size={14} />
                  Export CSV
                </button>
              </div>

              {/* Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Forecast Visualization</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={forecastResult.forecasts || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="lowerBound"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                      name="Lower Bound"
                    />
                    <Area
                      type="monotone"
                      dataKey="upperBound"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                      name="Upper Bound"
                    />
                    <Line type="monotone" dataKey="value" stroke="#ff7300" name="Forecast" strokeWidth={2} />
                  </ComposedChart>
                </ResponsiveContainer>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  Confidence Level: {Math.round((forecastResult.confidenceLevel || 0.85) * 100)}%
                </p>
              </div>

              {/* Forecast Table */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h3 className="font-semibold">Forecast Details</h3>
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Forecast Value</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Lower Bound</th>
                        <th className="px-4 py-2 text-left text-xs font-medium">Upper Bound</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {forecastResult.forecasts?.map((f: any, i: number) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-2 text-sm">{f.date}</td>
                          <td className="px-4 py-2 text-sm font-semibold">
                            {typeof f.value === 'number' ? f.value.toFixed(2) : f.value}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {typeof f.lowerBound === 'number' ? f.lowerBound.toFixed(2) : f.lowerBound}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-500">
                            {typeof f.upperBound === 'number' ? f.upperBound.toFixed(2) : f.upperBound}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-12 text-center">
              <TrendingUp size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500 dark:text-gray-400">Configure and generate a forecast to see results</p>
              <p className="text-sm text-gray-400 mt-2">Select a dataset and target column, then click Generate Forecast</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}