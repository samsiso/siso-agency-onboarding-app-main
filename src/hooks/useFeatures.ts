
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Feature, FeatureFilter, SortOption } from '@/types/feature.types';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

export function useFeatures() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [filter, setFilter] = useState<FeatureFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('priority');
  const { id: routeId } = useParams<{ id: string }>();

  const { 
    data: projectId,
    isLoading: projectLoading,
    error: projectError,
    refetch: refetchProject
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
        toast({
          title: "Error loading project",
          description: "Could not load project details. Please try again.",
          variant: "destructive"
        });
        throw error;
      }

      console.log('Found project ID:', data?.id);
      return data?.id;
    },
    enabled: routeId === 'ubahcrypt',
    retry: 2,
    retryDelay: 1000
  });

  const { 
    data: features, 
    isLoading: featuresLoading, 
    error: featuresError,
    refetch: refetchFeatures
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
        toast({
          title: "Error loading features",
          description: "Could not load feature data. Please try again.",
          variant: "destructive"
        });
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

  const handleRetry = () => {
    if (projectError) {
      refetchProject();
    } else if (featuresError) {
      refetchFeatures();
    }
  };

  const filteredFeatures = features ? filterFeatures(features, filter) : [];
  const sortedFeatures = sortFeatures(filteredFeatures, sortBy);

  return {
    features: sortedFeatures,
    isLoading: projectLoading || featuresLoading,
    error: projectError || featuresError,
    selectedFeature,
    handleViewFeatureDetails,
    handleCloseFeatureDetails,
    projectId,
    filter,
    setFilter,
    sortBy,
    setSortBy,
    handleRetry
  };
}

// Helper functions for filtering and sorting features
function filterFeatures(features: Feature[], filter: FeatureFilter): Feature[] {
  switch (filter) {
    case 'completed':
      return features.filter(f => f.status === 'completed');
    case 'in_progress':
      return features.filter(f => f.status === 'in_progress');
    case 'pending':
      return features.filter(f => f.status === 'pending');
    case 'high_priority':
      return features.filter(f => f.priority === 'high');
    default:
      return features;
  }
}

function sortFeatures(features: Feature[], sortBy: SortOption): Feature[] {
  return [...features].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        // Sort by priority (high, medium, low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      case 'difficulty':
        // Sort by difficulty (high, medium, low)
        const difficultyOrder = { high: 0, medium: 1, low: 2 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'cost':
        // Sort by estimated cost (high to low)
        return b.estimated_cost - a.estimated_cost;
      case 'title':
        // Sort alphabetically by title
        return a.title.localeCompare(b.title);
      case 'timeline':
        // Sort by timeline_week (if available)
        const timelineA = a.timeline_week || Infinity;
        const timelineB = b.timeline_week || Infinity;
        return timelineA - timelineB;
      default:
        return 0;
    }
  });
}
