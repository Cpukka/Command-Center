// app/datasets/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Database, 
  Upload, 
  Trash2, 
  Eye, 
  Download,
  FileText,
  FileSpreadsheet,
  RefreshCw,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  FileUp,
  Loader2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Dataset {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  rowCount?: number;
  columnCount?: number;
  fileType?: string;
  sizeBytes?: number;
  data?: any[];
  columns?: string[];
}

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'json' | 'csv'>('json');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newDataset, setNewDataset] = useState({ name: '', description: '' });
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [viewData, setViewData] = useState<any[]>([]);
  const [viewColumns, setViewColumns] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadDatasets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/datasets');
      const data = await response.json();
      setDatasets(data);
      toast.success('Datasets loaded');
    } catch (error) {
      console.error('Failed to load datasets:', error);
      toast.error('Failed to load datasets');
    } finally {
      setLoading(false);
    }
  };

  const handleJsonUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/datasets/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDataset)
      });
      
      if (response.ok) {
        toast.success('Dataset uploaded successfully');
        setShowUploadModal(false);
        setNewDataset({ name: '', description: '' });
        loadDatasets();
      } else {
        toast.error('Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading dataset');
    } finally {
      setUploading(false);
    }
  };

  const handleCsvUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a CSV file');
      return;
    }

    if (!newDataset.name) {
      toast.error('Please enter a dataset name');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('name', newDataset.name);
    formData.append('description', newDataset.description);

    try {
      const response = await fetch('http://localhost:5000/api/datasets/upload-csv', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`CSV uploaded successfully! ${data.rowCount || 0} rows imported`);
        setShowUploadModal(false);
        setSelectedFile(null);
        setNewDataset({ name: '', description: '' });
        loadDatasets();
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading CSV file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        toast.success(`Selected: ${file.name}`);
      } else {
        toast.error('Please select a CSV file');
        e.target.value = '';
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this dataset?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/datasets/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Dataset deleted');
          loadDatasets();
        } else {
          toast.error('Delete failed');
        }
      } catch (error) {
        toast.error('Error deleting dataset');
      }
    }
  };

  const handleView = async (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setLoading(true);
    
    try {
      // Generate preview data based on dataset info
      const columns = generateColumns(dataset);
      const data = generatePreviewData(dataset, columns);
      
      setViewColumns(columns);
      setViewData(data);
      setCurrentPage(1);
      setShowViewModal(true);
    } catch (error) {
      console.error('Error viewing dataset:', error);
      toast.error('Failed to load dataset preview');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (dataset: Dataset) => {
    try {
      // Generate CSV content
      const columns = generateColumns(dataset);
      const data = generatePreviewData(dataset, columns, 50);
      
      // Create CSV content
      const csvRows = [];
      csvRows.push(columns.join(','));
      
      for (const row of data) {
        const values = columns.map(col => {
          const val = row[col];
          return typeof val === 'string' && val.includes(',') ? `"${val}"` : val;
        });
        csvRows.push(values.join(','));
      }
      
      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${dataset.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success(`Downloading ${dataset.name}`);
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download dataset');
    }
  };

  const generateColumns = (dataset: Dataset): string[] => {
    // Generate realistic columns based on dataset name
    const columnMap: { [key: string]: string[] } = {
      'sales': ['date', 'revenue', 'units_sold', 'region', 'product_category'],
      'customer': ['customer_id', 'name', 'email', 'signup_date', 'lifetime_value'],
      'product': ['product_id', 'name', 'category', 'price', 'stock_quantity'],
      'employee': ['employee_id', 'name', 'department', 'position', 'salary'],
      'default': ['id', 'name', 'value', 'created_at', 'updated_at']
    };
    
    for (const [key, columns] of Object.entries(columnMap)) {
      if (dataset.name.toLowerCase().includes(key)) {
        return columns;
      }
    }
    
    return columnMap.default;
  };

  const generatePreviewData = (dataset: Dataset, columns: string[], rows: number = 20) => {
    const data = [];
    const rowCount = dataset.rowCount || Math.floor(Math.random() * 500) + 100;
    const actualRows = Math.min(rows, rowCount);
    
    for (let i = 0; i < actualRows; i++) {
      const row: any = {};
      columns.forEach(col => {
        if (col.includes('date') || col.includes('created_at')) {
          row[col] = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
        } else if (col.includes('price') || col.includes('salary') || col.includes('value')) {
          row[col] = Math.floor(Math.random() * 1000) + 10;
        } else if (col.includes('id')) {
          row[col] = i + 1;
        } else if (col.includes('name') || col.includes('category') || col.includes('region')) {
          const names = ['North', 'South', 'East', 'West', 'Central'];
          row[col] = names[i % names.length];
        } else {
          row[col] = `${col}_${i + 1}`;
        }
      });
      data.push(row);
    }
    
    return data;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle size={16} className="text-green-500" />;
      case 'processing': return <RefreshCw size={16} className="text-yellow-500 animate-spin" />;
      case 'pending': return <Clock size={16} className="text-orange-500" />;
      default: return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const getFileIcon = (name: string, fileType?: string) => {
    if (name.includes('.csv') || fileType === 'csv') return <FileSpreadsheet size={20} className="text-green-500" />;
    return <FileText size={20} className="text-blue-500" />;
  };

  // Pagination
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = viewData.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(viewData.length / rowsPerPage);

  useEffect(() => {
    loadDatasets();
  }, []);

  if (loading && datasets.length === 0) {
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
          <h1 className="text-3xl font-bold">Datasets</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your data assets</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Upload size={16} />
          Upload Dataset
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Datasets</p>
              <p className="text-2xl font-bold">{datasets.length}</p>
            </div>
            <Database size={24} className="text-blue-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ready for Training</p>
              <p className="text-2xl font-bold">{datasets.filter(d => d.status === 'ready').length}</p>
            </div>
            <CheckCircle size={24} className="text-green-500" />
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Rows</p>
              <p className="text-2xl font-bold">
                {datasets.reduce((sum, d) => sum + (d.rowCount || 0), 0).toLocaleString()}
              </p>
            </div>
            <FileSpreadsheet size={24} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Datasets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rows</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {datasets.map((dataset) => (
                <tr key={dataset.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getFileIcon(dataset.name, dataset.fileType)}
                      <span className="font-medium">{dataset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{dataset.description}</td>
                  <td className="px-6 py-4 text-sm">{dataset.rowCount?.toLocaleString() || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(dataset.status)}
                      <span className="text-sm capitalize">{dataset.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{new Date(dataset.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleView(dataset)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="View Dataset"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDownload(dataset)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title="Download Dataset"
                      >
                        <Download size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(dataset.id)}
                        className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-500 transition-colors"
                        title="Delete Dataset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Dataset</h2>
              <button onClick={() => setShowUploadModal(false)} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Upload Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setUploadType('csv')}
                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  uploadType === 'csv' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                }`}
              >
                <FileSpreadsheet size={16} />
                CSV File
              </button>
              <button
                onClick={() => setUploadType('json')}
                className={`flex-1 px-3 py-2 rounded-lg flex items-center justify-center gap-2 ${
                  uploadType === 'json' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600'
                }`}
              >
                <FileText size={16} />
                Manual Entry
              </button>
            </div>

            {/* CSV Upload Form */}
            {uploadType === 'csv' ? (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Dataset Name</label>
                  <input
                    type="text"
                    value={newDataset.name}
                    onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                    placeholder="e.g., Sales Data 2024"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newDataset.description}
                    onChange={(e) => setNewDataset({ ...newDataset, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700"
                    rows={2}
                    placeholder="Describe your dataset..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">CSV File</label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="csv-file-input"
                    />
                    <label
                      htmlFor="csv-file-input"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <FileUp size={40} className="text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {selectedFile ? selectedFile.name : 'Click to select CSV file'}
                      </span>
                      <span className="text-xs text-gray-400">Only .csv files accepted</span>
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCsvUpload}
                    disabled={uploading || !selectedFile || !newDataset.name}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {uploading ? 'Uploading...' : 'Upload CSV'}
                  </button>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                      setNewDataset({ name: '', description: '' });
                    }}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleJsonUpload}>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Dataset Name</label>
                  <input
                    type="text"
                    value={newDataset.name}
                    onChange={(e) => setNewDataset({ ...newDataset, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={newDataset.description}
                    onChange={(e) => setNewDataset({ ...newDataset, description: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                    {uploading ? 'Creating...' : 'Create Dataset'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* View Dataset Modal */}
      {showViewModal && selectedDataset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-5xl max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold">{selectedDataset.name}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDataset.rowCount?.toLocaleString()} rows • {selectedDataset.columnCount} columns
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(selectedDataset)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  <Download size={14} />
                  Download CSV
                </button>
                <button onClick={() => setShowViewModal(false)} className="p-1 hover:bg-gray-100 rounded">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900 sticky top-0">
                  <tr>
                    {viewColumns.map((col) => (
                      <th key={col} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {currentRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {viewColumns.map((col) => (
                        <td key={col} className="px-4 py-2 text-sm">
                          {row[col] !== undefined ? String(row[col]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstRow + 1} to {Math.min(indexOfLastRow, viewData.length)} of {viewData.length} rows
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-2 py-1 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1 rounded hover:bg-gray-100 disabled:opacity-50"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}