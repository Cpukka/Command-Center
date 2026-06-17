// app/settings/page.tsx
'use client';

import { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Palette,
  Globe,
  Mail,
  Key,
  Save,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@commandcenter.com',
    company: 'Command Center Inc.',
    role: 'Administrator'
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    pushNotifications: true,
    trainingComplete: true,
    predictionReady: true,
    systemUpdates: false
  });
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    fontSize: 'medium',
    compactView: false
  });
  const [apiConfig, setApiConfig] = useState({
    backendUrl: 'http://localhost:5000',
    aiServiceUrl: 'http://localhost:8000',
    refreshInterval: 30
  });

  const handleSaveProfile = () => {
    toast.success('Profile settings saved');
  };

  const handleSaveNotifications = () => {
    toast.success('Notification preferences saved');
  };

  const handleSaveAppearance = () => {
    toast.success('Appearance settings saved');
    // Apply theme change
    if (appearance.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleSaveAPI = () => {
    toast.success('API configuration saved');
  };

  const testConnection = async () => {
    try {
      const response = await fetch(`${apiConfig.backendUrl}/api/health`);
      if (response.ok) {
        toast.success('Backend connection successful');
      } else {
        toast.error('Backend connection failed');
      }
    } catch (error) {
      toast.error('Cannot connect to backend');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'api', label: 'API Configuration', icon: Database },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Configure your Command Center preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-r-4 border-blue-600'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={18} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Company</label>
                    <input
                      type="text"
                      value={profile.company}
                      onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <input
                      type="text"
                      value={profile.role}
                      disabled
                      className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                    />
                  </div>
                  <button
                    onClick={handleSaveProfile}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Save size={16} />
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Email Alerts</p>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.emailAlerts}
                        onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">Show browser notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications.pushNotifications}
                        onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  <button onClick={handleSaveNotifications} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Save size={16} />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Appearance Settings */}
            {activeTab === 'appearance' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <select
                      value={appearance.theme}
                      onChange={(e) => setAppearance({ ...appearance, theme: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="light">Light</option>
                      <option value="dark">Dark</option>
                      <option value="system">System</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Font Size</label>
                    <select
                      value={appearance.fontSize}
                      onChange={(e) => setAppearance({ ...appearance, fontSize: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    >
                      <option value="small">Small</option>
                      <option value="medium">Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  <button onClick={handleSaveAppearance} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Save size={16} />
                    Apply Changes
                  </button>
                </div>
              </div>
            )}

            {/* API Configuration */}
            {activeTab === 'api' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Backend API URL</label>
                    <input
                      type="text"
                      value={apiConfig.backendUrl}
                      onChange={(e) => setApiConfig({ ...apiConfig, backendUrl: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">AI Service URL</label>
                    <input
                      type="text"
                      value={apiConfig.aiServiceUrl}
                      onChange={(e) => setApiConfig({ ...apiConfig, aiServiceUrl: e.target.value })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Data Refresh Interval (seconds)</label>
                    <input
                      type="number"
                      value={apiConfig.refreshInterval}
                      onChange={(e) => setApiConfig({ ...apiConfig, refreshInterval: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={handleSaveAPI} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Save size={16} />
                      Save Configuration
                    </button>
                    <button onClick={testConnection} className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                      <RefreshCw size={16} />
                      Test Connection
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <input type="password" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <input type="password" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <input type="password" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                    <Key size={16} />
                    Update Password
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}