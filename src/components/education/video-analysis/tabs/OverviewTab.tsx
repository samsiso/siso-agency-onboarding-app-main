
import { VideoAnalysis } from '@/components/education/types/analysis';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, BarChart3, Brain } from 'lucide-react';

interface OverviewTabProps {
  analysis: VideoAnalysis;
}

export function OverviewTab({ analysis }: OverviewTabProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Estimated Time</h3>
        </div>
        <p className="text-2xl font-bold mb-2">{analysis.estimated_completion_time} minutes</p>
        <p className="text-sm text-gray-500">Recommended viewing time</p>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Complexity Analysis</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Technical Complexity</span>
              <span>{Math.round(analysis.complexity_score * 100)}%</span>
            </div>
            <Progress value={analysis.complexity_score * 100} />
          </div>
          <p className="text-sm text-gray-500">Difficulty Level: {analysis.difficulty_level}</p>
        </div>
      </Card>

      {analysis.code_quality_metrics && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold">Code Quality Insights</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Quality</span>
                <span>{analysis.code_quality_metrics.overall_score}%</span>
              </div>
              <Progress value={analysis.code_quality_metrics.overall_score} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Best Practices</h4>
              <ul className="space-y-2">
                {analysis.code_quality_metrics.best_practices.map((practice, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    • {practice}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
