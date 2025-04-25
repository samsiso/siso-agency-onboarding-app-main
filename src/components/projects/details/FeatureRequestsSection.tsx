
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { useFeatures } from '@/hooks/useFeatures';
import { FeatureCard } from '../features/FeatureCard';
import { Feature } from '@/types/feature.types';

export function FeatureRequestsSection() {
  const [request, setRequest] = useState('');
  // Replace with actual project ID when integrated
  const projectId = 'some-project-id'; 
  const { 
    features, 
    selectedFeature, 
    handleViewFeatureDetails, 
    handleCloseFeatureDetails 
  } = useFeatures(projectId);

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-white">Project Features</h3>
        <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {features?.map(feature => (
          <FeatureCard 
            key={feature.id} 
            feature={feature} 
            onViewDetails={handleViewFeatureDetails} 
          />
        ))}
      </div>

      {/* Feature Details Modal (placeholder) */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {selectedFeature.title}
            </h2>
            <p className="mb-4">{selectedFeature.description}</p>
            <Button onClick={handleCloseFeatureDetails}>Close</Button>
          </div>
        </div>
      )}

      {/* Feature Request Form */}
      <div className="space-y-4">
        <Textarea 
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Describe the feature you'd like to request..."
          className="bg-black/20 border-gray-700 text-white"
        />
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Estimated Cost</span>
            <span>£500 - £1,000</span>
          </div>
          <Button 
            className="w-full bg-[#9b87f5] hover:bg-[#9b87f5]/90"
            disabled
          >
            Submit Request (Coming Soon)
          </Button>
        </div>
      </div>
    </Card>
  );
}
