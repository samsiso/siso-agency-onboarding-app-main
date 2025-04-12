
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { usePlanContext } from '@/contexts/plan/PlanContext';
import { PainPointDetailProps } from '@/contexts/plan/PlanContext';

export const usePlanActions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    setSelectedPainPoint,
    setShowPainPointModal,
    setShowSolutionsSection,
    setShowFeatureSelection,
    setSelectedFeatures,
    setIsSubmitting
  } = usePlanContext();
  
  const handlePainPointClick = (painPoint: PainPointDetailProps) => {
    setSelectedPainPoint(painPoint);
    setShowPainPointModal(true);
  };
  
  const handleFinalizeFeatures = (features: string[]) => {
    setSelectedFeatures(features);
    
    setTimeout(() => {
      const reviewSection = document.getElementById('review-section');
      if (reviewSection) {
        reviewSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };
  
  const handleApprovePlan = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Plan Approved!",
        description: "Your selections have been saved. We'll contact you shortly to begin implementation.",
      });
      setIsSubmitting(false);
      
      navigate('/dashboard');
    }, 2000);
  };

  return {
    handlePainPointClick,
    handleFinalizeFeatures,
    handleApprovePlan
  };
};
