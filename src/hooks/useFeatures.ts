
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feature } from '@/types/feature.types';
import { supabase } from '@/integrations/supabase/client';

export function useFeatures(projectId: string) {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  const { 
    data: features, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['project_features', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_features')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data as Feature[];
    }
  });

  const handleViewFeatureDetails = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const handleCloseFeatureDetails = () => {
    setSelectedFeature(null);
  };

  return {
    features,
    isLoading,
    error,
    selectedFeature,
    handleViewFeatureDetails,
    handleCloseFeatureDetails
  };
}
