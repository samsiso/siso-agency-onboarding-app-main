
import { useState } from 'react';

export interface FeatureDetailState {
  id?: string;
  name?: string;
  description?: string;
  tier?: 'mvp' | 'advanced' | 'premium';
  recommended?: boolean;
  category?: string;
  categoryName?: string;
  timeEstimate?: number;
  roi?: string;
}

export function useFeatureDetail() {
  const [featureDetail, setFeatureDetail] = useState<FeatureDetailState | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const handleShowFeatureDetail = (feature: any, categoryName: string) => {
    setFeatureDetail({
      ...feature,
      categoryName
    });
    setIsDetailOpen(true);
  };
  
  return {
    featureDetail,
    isDetailOpen,
    setIsDetailOpen,
    handleShowFeatureDetail
  };
}
