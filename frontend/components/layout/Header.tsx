// frontend/components/layout/Header.tsx
'use client';

import { useState } from 'react';
import { 
  Moon, 
  Sun, 
  User, 
  LogOut, 
  Settings, 
  Bell,
  ChevronDown,
  Shield,
  HelpCircle,
  Home
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '@/components/NotificationCenter';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    // Force navigation to home
    router.push('/');
  };

  return (
    <header className="fixed left-64 right-0 top-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between z-10">
      {/* Search Bar - Optional */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center gap-3">
        {/* Home Button - Navigate to Dashboard */}
        <Link
          href="/dashboard"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Dashboard"
        >
          <Home size={20} />
        </Link>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <NotificationCenter />

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {user?.username?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium dark:text-white">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Admin'}</p>
            </div>
            <ChevronDown size={16} className="hidden md:block dark:text-white" />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-semibold dark:text-white">{user?.username || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@commandcenter.com'}</p>
                </div>
                <div className="py-2">
                  <Link
                    href="/dashboard"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Home size={16} />
                    Dashboard
                  </Link>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <User size={16} />
                    Profile
                  </button>
                  <Link
                    href="/settings"
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <Shield size={16} />
                    Security
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                    <HelpCircle size={16} />
                    Help
                  </button>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}