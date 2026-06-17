// app/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Trash2,
  FileSpreadsheet,
  FileJson,
  FileImage,
  Clock,
  CheckCircle,
  Plus,
  X,
  Loader2,
  TrendingUp,
  Database,
  Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Report {
  id: number;
  name: string;
  type: 'pdf' | 'excel' | 'json' | 'image';
  format: string;
  status: string;
  createdAt: string;
  size: string;
  content?: any;
  fileUrl?: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [generating, setGenerating] = useState(false);
  const [newReport, setNewReport] = useState({ 
    name: '', 
    type: 'pdf', 
    format: 'PDF',
    dataSource: 'dashboard',
    dateRange: 'last30days'
  });

  // Load saved reports from localStorage on mount
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    try {
      const savedReports = localStorage.getItem('command_center_reports');
      if (savedReports) {
        setReports(JSON.parse(savedReports));
      } else {
        // Load sample reports
        const sampleReports: Report[] = [
          {
            id: 1,
            name: 'Sales Performance Report',
            type: 'pdf',
            format: 'PDF',
            status: 'ready',
            createdAt: new Date().toISOString(),
            size: '2.4 MB',
            content: { summary: 'Total sales increased by 15% this quarter' }
          },
          {
            id: 2,
            name: 'ML Model Accuracy Analysis',
            type: 'excel',
            format: 'Excel',
            status: 'ready',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            size: '1.8 MB',
            content: { models: ['Sales Predictor', 'Churn Model'], accuracy: [94, 87] }
          },
          {
            id: 3,
            name: 'Forecast Dashboard',
            type: 'image',
            format: 'PNG',
            status: 'ready',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            size: '0.5 MB'
          }
        ];
        setReports(sampleReports);
        localStorage.setItem('command_center_reports', JSON.stringify(sampleReports));
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveReports = (updatedReports: Report[]) => {
    setReports(updatedReports);
    localStorage.setItem('command_center_reports', JSON.stringify(updatedReports));
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText size={20} className="text-red-500" />;
      case 'excel': return <FileSpreadsheet size={20} className="text-green-500" />;
      case 'json': return <FileJson size={20} className="text-blue-500" />;
      case 'image': return <FileImage size={20} className="text-purple-500" />;
      default: return <FileText size={20} />;
    }
  };

  const generateReportContent = (type: string, name: string, dataSource: string) => {
    const timestamp = new Date().toLocaleString();
    
    switch (type) {
      case 'pdf':
        return {
          title: name,
          generatedAt: timestamp,
          dataSource: dataSource,
          summary: `This report provides comprehensive analytics for ${dataSource} data.`,
          metrics: {
            totalDatasets: Math.floor(Math.random() * 50) + 10,
            activeModels: Math.floor(Math.random() * 20) + 1,
            predictionsToday: Math.floor(Math.random() * 1000) + 100,
            averageAccuracy: `${Math.floor(Math.random() * 20) + 75}%`
          },
          insights: [
            "Data volume has increased by 23% this month",
            "Model accuracy improved by 5% after retraining",
            "Peak prediction usage occurs on weekdays"
          ]
        };
      
      case 'excel':
        return {
          title: name,
          generatedAt: timestamp,
          dataSource: dataSource,
          data: Array.from({ length: 50 }, (_, i) => ({
            date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
            value: Math.floor(Math.random() * 1000) + 100,
            category: ['Sales', 'Revenue', 'Users'][i % 3]
          }))
        };
      
      case 'json':
        return {
          title: name,
          generatedAt: timestamp,
          dataSource: dataSource,
          metadata: {
            version: "1.0",
            apiEndpoint: "/api/reports",
            dataFormat: "JSON"
          },
          data: {
            datasets: 25,
            models: 8,
            predictions: 15420
          }
        };
      
      default:
        return { message: "Report generated successfully", timestamp };
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const content = generateReportContent(newReport.type, newReport.name, newReport.dataSource);
      
      const newReportObj: Report = {
        id: Date.now(),
        name: newReport.name,
        type: newReport.type as any,
        format: newReport.format,
        status: 'ready',
        createdAt: new Date().toISOString(),
        size: `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 9) + 1} MB`,
        content: content,
        fileUrl: URL.createObjectURL(new Blob([JSON.stringify(content)], { type: 'application/json' }))
      };
      
      const updatedReports = [newReportObj, ...reports];
      saveReports(updatedReports);
      
      toast.success(`Report "${newReport.name}" generated successfully!`);
      setShowCreateModal(false);
      setNewReport({ name: '', type: 'pdf', format: 'PDF', dataSource: 'dashboard', dateRange: 'last30days' });
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = (report: Report) => {
    try {
      let content: any = {};
      let filename = `${report.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
      let blob: Blob;
      
      switch (report.type) {
        case 'pdf':
        case 'image':
          // For demo, create a text file with report content
          content = report.content || { message: "Report content would be here" };
          blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
          filename += '.json';
          break;
        case 'excel':
          // Create CSV content
          if (report.content?.data) {
            const headers = Object.keys(report.content.data[0] || {}).join(',');
            const rows = report.content.data.map((row: any) => Object.values(row).join(',')).join('\n');
            content = `${headers}\n${rows}`;
            blob = new Blob([content], { type: 'text/csv' });
            filename += '.csv';
          } else {
            blob = new Blob([JSON.stringify(report.content, null, 2)], { type: 'application/json' });
            filename += '.json';
          }
          break;
        default:
          blob = new Blob([JSON.stringify(report.content || { message: "Report data" }, null, 2)], { type: 'application/json' });
          filename += '.json';
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloading ${report.name}`);
    } catch (error) {
      toast.error('Failed to download report');
    }
  };

  const handleView = (report: Report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const handleDelete = (id: number) => {
    const updatedReports = reports.filter(r => r.id !== id);
    saveReports(updatedReports);
    toast.success('Report deleted');
  };

  const getTotalSize = () => {
    return reports.reduce((total, report) => {
      const size = parseFloat(report.size);
      return total + (isNaN(size) ? 0 : size);
    }, 0).toFixed(1);
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
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Generate and manage analytics reports</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-bold">{reports.length}</p>
            </div>
            <FileText size={24} className="text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready to Download</p>
              <p className="text-2xl font-bold">{reports.filter(r => r.status === 'ready').length}</p>
            </div>
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Size</p>
              <p className="text-2xl font-bold">{getTotalSize()} MB</p>
            </div>
            <Clock size={24} className="text-orange-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Report Types</p>
              <p className="text-2xl font-bold">{new Set(reports.map(r => r.type)).size}</p>
            </div>
            <TrendingUp size={24} className="text-purple-500" />
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {reports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
              <p className="text-gray-500 mb-4">Generate your first report to get insights</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus size={16} />
                Generate Report
              </button>
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getReportIcon(report.type)}
                    <div>
                      <h3 className="font-semibold">{report.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">{report.format}</span>
                        <span className="text-xs text-gray-500">{report.size}</span>
                        <span className="text-xs text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDownload(report)}
                      className="px-3 py-1 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 flex items-center gap-1 transition-colors"
                    >
                      <Download size={14} />
                      Download
                    </button>
                    <button 
                      onClick={() => handleView(report)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                      title="View Report"
                    >
                      <Eye size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(report.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500 transition-colors"
                      title="Delete Report"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Generate New Report</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleGenerateReport}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Report Name</label>
                <input
                  type="text"
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                  placeholder="e.g., Q4 Sales Analysis"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Report Type</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({ ...newReport, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="json">JSON Data</option>
                  <option value="image">PNG Image</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Data Source</label>
                <select
                  value={newReport.dataSource}
                  onChange={(e) => setNewReport({ ...newReport, dataSource: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                >
                  <option value="dashboard">Dashboard Analytics</option>
                  <option value="datasets">Datasets Overview</option>
                  <option value="models">ML Models Performance</option>
                  <option value="forecasts">Forecasting Results</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button 
                  type="submit" 
                  disabled={generating}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                  {generating ? 'Generating...' : 'Generate Report'}
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)} 
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedReport.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Generated on {new Date(selectedReport.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Report Content Preview */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Report Summary</h3>
                {selectedReport.content ? (
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(selectedReport.content, null, 2)}
                  </pre>
                ) : (
                  <p className="text-gray-500">No preview available. Download the report to view full content.</p>
                )}
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(selectedReport)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download Full Report
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}