'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  Brain, 
  LineChart, 
  FileText, 
  Settings,
  ChevronRight
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/datasets', label: 'Datasets', icon: Database },
  { href: '/ml', label: 'ML Models', icon: Brain },
  { href: '/forecasting', label: 'Forecasting', icon: LineChart },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white overflow-y-auto">
      {/* Logo Section - Clickable */}
      <Link href="/dashboard" className="block p-6 hover:bg-gray-800 transition-colors cursor-pointer border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">CC</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">Command Center</h1>
            <p className="text-xs text-gray-400 mt-0.5">Analytics Platform</p>
          </div>
        </div>
      </Link>
      
      <nav className="mt-6 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 mb-1 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </div>
              {isActive && <ChevronRight size={16} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800 bg-gray-900">
        <div className="text-xs text-gray-500 text-center">
          <p>Version 1.0.0</p>
          <p className="mt-1">© 2024 Command Center</p>
        </div>
      </div>
    </aside>
  );
}