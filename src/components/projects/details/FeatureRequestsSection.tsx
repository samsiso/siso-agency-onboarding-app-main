
import { Card } from '@/components/ui/card';
import { useFeatures } from '@/hooks/useFeatures';
import { FeatureCard } from '../features/FeatureCard';
import { FeatureDetailsModal } from '../features/FeatureDetailsModal';
import { FeatureControls } from '../features/FeatureControls';
import { FeatureLoadingState } from '../features/FeatureLoadingState';
import { FeatureErrorState } from '../features/FeatureErrorState';
import { FeatureRequestInput } from '../features/FeatureRequestInput';
import { MessageSquare } from 'lucide-react';

export function FeatureRequestsSection() {
  const { 
    features, 
    isLoading,
    error,
    selectedFeature, 
    handleViewFeatureDetails, 
    handleCloseFeatureDetails,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    handleRetry
  } = useFeatures();

  if (isLoading) {
    return (
      <Card className="p-6 bg-black/30 border-siso-text/10">
        <FeatureLoadingState />
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
        <FeatureErrorState 
          message={`Error loading features: ${error instanceof Error ? error.message : 'Unknown error'}`}
          onRetry={handleRetry}
        />
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center justify-between gap-2 mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-white">Project Features</h3>
          <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
        </div>
        <FeatureControls 
          filter={filter} 
          setFilter={setFilter} 
          sortBy={sortBy} 
          setSortBy={setSortBy}
          hasError={!!error}
          onRetry={handleRetry}
          isLoading={isLoading}
        />
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {features && features.length > 0 ? (
          features.map(feature => (
            <FeatureCard 
              key={feature.id} 
              feature={feature} 
              onViewDetails={handleViewFeatureDetails} 
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 bg-black/20 rounded-lg border border-siso-text/10">
            <p className="text-gray-400">
              {filter !== 'all' 
                ? 'No features match the current filter. Try changing your filter.'
                : 'No features have been added yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Feature Details Modal */}
      <FeatureDetailsModal 
        feature={selectedFeature} 
        onClose={handleCloseFeatureDetails} 
      />

      {/* Feature Request Form */}
      <div className="border-t border-siso-text/10 pt-6">
        <FeatureRequestInput />
      </div>
    </Card>
  );
}
