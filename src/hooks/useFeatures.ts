
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feature } from '@/types/feature.types';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

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
      if (!projectId) {
        console.log('No project ID provided');
        return [];
      }
      
      console.log('Fetching features for project:', projectId);
      
      const { data, error } = await supabase
        .from('project_features')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching features:', error);
        toast({
          title: 'Error fetching features',
          description: error.message,
          variant: 'destructive',
        });
        throw error;
      }

      console.log('Fetched features:', data);
      return data as Feature[];
    },
    enabled: !!projectId,
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
