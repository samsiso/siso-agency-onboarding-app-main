
export type FeatureDifficulty = 'low' | 'medium' | 'high';
export type FeaturePriority = 'low' | 'medium' | 'high';
export type FeatureStatus = 'pending' | 'in_progress' | 'completed';
export type FeatureFilter = 'all' | 'pending' | 'in_progress' | 'completed' | 'high_priority';
export type SortOption = 'priority' | 'difficulty' | 'cost' | 'title' | 'timeline';

export interface Feature {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  difficulty: FeatureDifficulty;
  estimated_cost: number;
  priority: FeaturePriority;
  implementation_plan?: string;
  timeline_week?: number;
  cost_breakdown?: Record<string, number>;
  status: FeatureStatus;
  created_at: string;
  updated_at: string;
}

export interface FeatureCardProps {
  feature: Feature;
  onViewDetails: (feature: Feature) => void;
}
