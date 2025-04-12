
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlanData } from '@/contexts/plan/PlanContext';

export const usePlanData = (username: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        if (!username) return;
        
        setLoading(true);
        
        // Mock data for now, could be replaced with API call
        setTimeout(() => {
          const mockData: PlanData = {
            id: '123',
            username: username,
            company_name: username === 'decora' ? 'Decora Agency' : 'Siso Agency',
            app_name: 'OnlyFans Management Suite',
            features: ['Content Management', 'Analytics Dashboard', 'Client Portal', 'Messaging System'],
            branding: {
              primary_color: '#3182CE',
              secondary_color: '#805AD5'
            },
            estimated_cost: 4997,
            estimated_days: 14,
            status: 'draft'
          };
          
          setPlanData(mockData);
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error fetching plan data:', error);
        toast({
          title: "Error loading plan",
          description: "Could not load the plan data. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    fetchPlanData();
  }, [username, toast]);

  return { loading, planData, setPlanData, setLoading };
};
