
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feature } from '@/types/feature.types';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';

export function useFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  // We don't need the id param anymore since we're getting project ID via query
  const { id: routeId } = useParams<{ id: string }>();

  const { 
    data: projectId,
    isLoading: projectLoading,
    error: projectError
  } = useQuery({
    queryKey: ['ubahcrypt_project'],
    queryFn: async () => {
      console.log('Fetching project ID for Ubahcrypt');
      const { data, error } = await supabase
        .from('plans')
        .select('id')
        .eq('app_name', 'Ubahcrypt')
        .single();

      if (error) {
        console.error('Error fetching Ubahcrypt project:', error);
        throw error;
      }

      console.log('Found project ID:', data?.id);
      return data?.id;
    },
    enabled: routeId === 'ubahcrypt'
  });

  const { 
    data: features, 
    isLoading: featuresLoading, 
    error: featuresError 
  } = useQuery({
    queryKey: ['project_features', projectId],
    queryFn: async () => {
      console.log('Fetching features for project:', projectId);
      
      const { data, error } = await supabase
        .from('project_features')
        .select('*')
        .eq('project_id', projectId);

      if (error) {
        console.error('Error fetching features:', error);
        throw error;
      }

      console.log('Found features:', data);
      return data as Feature[];
    },
    enabled: !!projectId // Only fetch features when we have a project ID
  });

  const handleViewFeatureDetails = (feature: Feature) => {
    setSelectedFeature(feature);
  };

  const handleCloseFeatureDetails = () => {
    setSelectedFeature(null);
  };

  return {
    features,
    isLoading: projectLoading || featuresLoading,
    error: projectError || featuresError,
    selectedFeature,
    handleViewFeatureDetails,
    handleCloseFeatureDetails,
    projectId
  };
}
