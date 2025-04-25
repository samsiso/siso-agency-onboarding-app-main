
export type FeatureDifficulty = 'low' | 'medium' | 'high';
export type FeaturePriority = 'low' | 'medium' | 'high';
export type FeatureStatus = 'pending' | 'in_progress' | 'completed';

export interface Feature {
  id: string;
  project_id: string;
  title: string;
  description?: string;
  difficulty: FeatureDifficulty;
  priority: FeaturePriority;
  status: FeatureStatus;
  estimated_cost: number;
  implementation_plan?: string;
  timeline_week?: number;
  cost_breakdown?: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface FeatureCardProps {
  feature: Feature;
  onViewDetails: (feature: Feature) => void;
}
