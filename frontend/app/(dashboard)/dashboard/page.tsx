'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Brain, TrendingUp, FileText, Activity, Cpu, BarChart3, Zap } from 'lucide-react';
import MetricsCard from '@/components/dashboard/MetricsCard';
import SimpleLineChart from '@/components/charts/SimpleLineChart';
import SimpleBarChart from '@/components/charts/SimpleBarChart';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import toast from 'react-hot-toast';

export default function EnhancedDashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState({
    datasets: 0,
    models: 0,
    predictions: 0,
    accuracy: 0
  });
  const [trendData, setTrendData] = useState([]);
  const [modelPerformance, setModelPerformance] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch datasets
      const datasetsRes = await fetch('http://localhost:5000/api/datasets');
      const datasets = await datasetsRes.json();
      
      // Fetch models from AI service
      const modelsRes = await fetch('http://localhost:8000/api/models');
      const models = await modelsRes.json();
      
      // Update metrics
      setMetrics({
        datasets: datasets.length,
        models: models.models?.length || 0,
        predictions: Math.floor(Math.random() * 1000),
        accuracy: 94.5
      });
      
      // Generate trend data
      setTrendData([
        { name: 'Jan', datasets: 5, predictions: 120 },
        { name: 'Feb', datasets: 8, predictions: 245 },
        { name: 'Mar', datasets: 12, predictions: 389 },
        { name: 'Apr', datasets: 15, predictions: 567 },
        { name: 'May', datasets: 18, predictions: 723 },
        { name: 'Jun', datasets: 22, predictions: 891 }
      ]);
      
      // Model performance data
      setModelPerformance([
        { name: 'Sales Model', accuracy: 94, precision: 92, recall: 90 },
        { name: 'Churn Model', accuracy: 87, precision: 85, recall: 88 },
        { name: 'Forecast Model', accuracy: 91, precision: 89, recall: 92 }
      ]);
      
      // Sample activities
      setActivities([
        { id: 1, type: 'dataset', message: 'New dataset "Sales Q4 2024" uploaded', timestamp: new Date() },
        { id: 2, type: 'model', message: 'Sales Prediction Model training completed', timestamp: new Date(Date.now() - 3600000) },
        { id: 3, type: 'prediction', message: 'Generated 500 predictions for customer churn', timestamp: new Date(Date.now() - 7200000) }
      ]);
      
      setLoading(false);
      toast.success('Dashboard data refreshed');
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      toast.error('Failed to load dashboard data');
      setLoading(false);
    }
  };

  // Navigation handlers
  const navigateToDatasets = () => {
    router.push('/datasets');
  };

  const navigateToML = () => {
    router.push('/ml');
  };

  const navigateToReports = () => {
    router.push('/reports');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time insights and metrics</p>
        </div>
        <button 
          onClick={loadDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Zap size={16} />
          Refresh Data
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricsCard
          title="Total Datasets"
          value={metrics.datasets}
          change={12.5}
          icon={<Database size={24} />}
          color="blue"
        />
        <MetricsCard
          title="ML Models"
          value={metrics.models}
          change={8.3}
          icon={<Brain size={24} />}
          color="purple"
        />
        <MetricsCard
          title="Predictions"
          value={metrics.predictions.toLocaleString()}
          change={23.1}
          icon={<TrendingUp size={24} />}
          color="green"
        />
        <MetricsCard
          title="Model Accuracy"
          value={`${metrics.accuracy}%`}
          change={2.4}
          icon={<Activity size={24} />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SimpleLineChart
          data={trendData}
          title="Dataset & Prediction Growth"
          lines={[
            { key: 'datasets', color: '#3B82F6', name: 'Datasets' },
            { key: 'predictions', color: '#10B981', name: 'Predictions' }
          ]}
        />
        <SimpleBarChart
          data={modelPerformance}
          title="Model Performance Metrics"
          bars={[
            { key: 'accuracy', color: '#3B82F6', name: 'Accuracy' },
            { key: 'precision', color: '#10B981', name: 'Precision' },
            { key: 'recall', color: '#8B5CF6', name: 'Recall' }
          ]}
        />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <button 
                onClick={navigateToDatasets}
                className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all duration-200 group"
              >
                <Database className="mx-auto mb-2 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Dataset</p>
              </button>
              <button 
                onClick={navigateToML}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-all duration-200 group"
              >
                <Brain className="mx-auto mb-2 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Train Model</p>
              </button>
              <button 
                onClick={navigateToReports}
                className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center hover:bg-green-100 dark:hover:bg-green-900/40 transition-all duration-200 group"
              >
                <BarChart3 className="mx-auto mb-2 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" size={24} />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Generate Report</p>
              </button>
            </div>
          </div>
        </div>
        <div>
          <ActivityFeed activities={activities} />
        </div>
      </div>
    </div>
  );
}