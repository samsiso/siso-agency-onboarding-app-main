
import { VideoAnalysis } from '../types/analysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface PracticeTabProps {
  analysis: VideoAnalysis;
}

export function PracticeTab({ analysis }: PracticeTabProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold">Practice Exercises</h3>
      </div>
      <div className="space-y-4">
        {analysis.practice_exercises.map((exercise, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-medium">{exercise.title}</h4>
                <span className="text-sm text-gray-500">{exercise.type} • {exercise.difficulty}</span>
              </div>
              <Button variant="outline" size="sm">
                Start Exercise
              </Button>
            </div>
            <p className="text-sm text-gray-600">{exercise.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
