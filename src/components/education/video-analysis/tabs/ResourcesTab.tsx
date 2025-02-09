
import { VideoAnalysis } from '../types/analysis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link2, ExternalLink } from 'lucide-react';

interface ResourcesTabProps {
  analysis: VideoAnalysis;
}

export function ResourcesTab({ analysis }: ResourcesTabProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Link2 className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold">External Resources</h3>
      </div>
      <div className="space-y-4">
        {analysis.external_resources.map((resource, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{resource.type}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="flex-shrink-0"
              onClick={() => window.open(resource.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
}
