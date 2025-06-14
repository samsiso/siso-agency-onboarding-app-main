import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  changeType = 'neutral' 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-400';
      case 'negative': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400 font-medium">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${getChangeColor()}`}>
              {change} from last month
            </p>
          )}
        </div>
        <div className="bg-orange-600/20 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-orange-500" />
        </div>
      </div>
    </div>
  );
} 