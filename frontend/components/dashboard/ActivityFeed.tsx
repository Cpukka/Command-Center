'use client';

import { Bell, Database, Brain, TrendingUp, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: number;
  type: 'dataset' | 'model' | 'prediction' | 'report';
  message: string;
  timestamp: Date;
}

const iconMap = {
  dataset: Database,
  model: Brain,
  prediction: TrendingUp,
  report: FileText
};

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Bell size={20} />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {activities.map(activity => {
          const Icon = iconMap[activity.type];
          return (
            <div key={activity.id} className="p-4 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm">{activity.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
