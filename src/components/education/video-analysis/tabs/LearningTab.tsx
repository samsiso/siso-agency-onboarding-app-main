
import { VideoAnalysis } from '@/components/education/types/analysis';
import { Card } from '@/components/ui/card';
import { BookOpen, BookMarked, CheckCircle } from 'lucide-react';

interface LearningTabProps {
  analysis: VideoAnalysis;
}

export function LearningTab({ analysis }: LearningTabProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Learning Outcomes</h3>
        </div>
        <ul className="space-y-3">
          {analysis.learning_outcomes.map((outcome, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <BookMarked className="w-5 h-5 text-gray-500" />
          <h3 className="text-lg font-semibold">Key Concepts</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {analysis.key_concepts.map((concept, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
            >
              {concept}
            </span>
          ))}
        </div>
      </Card>
    </div>
  );
}
