
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare } from 'lucide-react';
import { useFeatures } from '@/hooks/useFeatures';
import { FeatureCard } from '../features/FeatureCard';
import { Skeleton } from '@/components/ui/skeleton';

export function FeatureRequestsSection() {
  const [request, setRequest] = useState('');
  const { 
    features, 
    isLoading,
    error,
    selectedFeature, 
    handleViewFeatureDetails, 
    handleCloseFeatureDetails 
  } = useFeatures();

  if (isLoading) {
    return (
      <Card className="p-6 bg-black/30 border-siso-text/10">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-white">Project Features</h3>
          <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className="h-48 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-black/30 border-siso-text/10">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-xl font-semibold text-white">Project Features</h3>
          <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <p className="text-red-400 text-sm">Error loading features: {error.message}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-white">Project Features</h3>
        <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {features && features.length > 0 ? (
          features.map(feature => (
            <FeatureCard 
              key={feature.id} 
              feature={feature} 
              onViewDetails={handleViewFeatureDetails} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-400">No features have been added yet.</p>
          </div>
        )}
      </div>

      {/* Feature Details Modal (placeholder) */}
      {selectedFeature && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black/80 border border-siso-text/20 p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4 text-white">
              {selectedFeature.title}
            </h2>
            <p className="mb-4 text-gray-300">{selectedFeature.description || 'No description provided'}</p>
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="bg-black/30 px-3 py-1 rounded-full text-sm">
                Difficulty: <span className="font-medium">{selectedFeature.difficulty}</span>
              </div>
              <div className="bg-black/30 px-3 py-1 rounded-full text-sm">
                Priority: <span className="font-medium">{selectedFeature.priority}</span>
              </div>
              <div className="bg-black/30 px-3 py-1 rounded-full text-sm">
                Cost: <span className="font-medium">£{selectedFeature.estimated_cost?.toLocaleString() || '0'}</span>
              </div>
            </div>
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
          rows={5}
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
