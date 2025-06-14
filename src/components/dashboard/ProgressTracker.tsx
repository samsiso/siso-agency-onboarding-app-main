import React from 'react';
import { Trophy } from 'lucide-react';

interface ProgressTrackerProps {
  current: number;
  target: number;
  label: string;
  reward?: string;
}

export function ProgressTracker({ current, target, label, reward }: ProgressTrackerProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const isCompleted = current >= target;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-white">{label}</h3>
          <p className="text-sm text-gray-400">
            {current} of {target} completed
          </p>
        </div>
        {reward && (
          <div className="flex items-center space-x-2 text-orange-500">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-medium">{reward}</span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-medium">{Math.round(percentage)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ease-out ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : 'bg-gradient-to-r from-orange-600 to-orange-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Status */}
      <div className={`text-sm font-medium ${
        isCompleted ? 'text-green-400' : 'text-gray-400'
      }`}>
        {isCompleted ? '🎉 Milestone completed!' : `${target - current} more to go`}
      </div>
    </div>
  );
} 