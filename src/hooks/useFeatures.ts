
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feature } from '@/types/feature.types';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';

export function useFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const { id: projectId } = useParams<{ id: string }>();

  const { 
    data: features, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['project_features', projectId],
    queryFn: async () => {
      if (!projectId) return [];
      
      const { data, error } = await supabase
        .from('project_features')
        .select('*')
        .eq('project_id', projectId);

      if (error) throw error;
      return data as Feature[];
    },
    enabled: !!projectId // Only run the query if we have a projectId
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
    handleCloseFeatureDetails,
    projectId
  };
}
