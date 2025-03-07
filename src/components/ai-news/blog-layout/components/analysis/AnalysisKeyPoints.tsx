
import React from 'react';

// [Analysis] This component renders the key points from the AI analysis
interface AnalysisKeyPointsProps {
  keyPoints: string[];
}

export const AnalysisKeyPoints = ({ keyPoints }: AnalysisKeyPointsProps) => {
  if (!keyPoints || keyPoints.length === 0) return null;
  
  return (
    <div>
      <h4 className="text-xs text-gray-400 mb-2">Key Points</h4>
      <ul className="space-y-1">
        {keyPoints.slice(0, 2).map((point, index) => (
          <li key={index} className="text-sm flex items-start gap-1">
            <span className="text-blue-400">•</span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
