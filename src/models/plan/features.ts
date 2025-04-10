
import { ReactNode } from 'react';

export interface Feature {
  id: string;
  name: string;
  description: string;
  price: number;
  included: boolean;
  timeEstimate?: number;
  category?: 'mvp' | 'advanced' | 'premium';
  recommended?: boolean;
  roi?: string;
}

export interface FeatureCategory {
  id: string;
  name: string;
  icon: ReactNode;
  features: FeatureItem[];
}

export interface FeatureItem {
  id: string;
  name: string;
  description: string;
  timeEstimate: number;
}

export interface PlanTier {
  id: string;
  name: string;
  price: number;
  maxFeatures: string | number;
  timeline: string;
  supportLevel: string;
  description: string;
  recommended?: boolean;
}
