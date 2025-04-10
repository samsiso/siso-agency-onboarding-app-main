
import { ReactNode } from 'react';

export interface FeatureCategory {
  id: string;
  name: string;
  icon: ReactNode;
  features: FeatureItem[];
  info?: string;  // Make info optional
  description?: string; // Keep description for backward compatibility
}

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  timeEstimate: number;
  category: string;
  tier: 'mvp' | 'advanced' | 'premium';
  recommended?: boolean;
  included?: boolean;
  roi?: string;
}
