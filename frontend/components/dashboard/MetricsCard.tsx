'use client';
import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react';

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: string;
}

export default function MetricsCard({ title, value, change, icon, color = 'blue' }: MetricsCardProps) {
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`${colors[color as keyof typeof colors]} p-3 rounded-full text-white`}>
          {icon}
        </div>
      </div>
    </div>
  );
}