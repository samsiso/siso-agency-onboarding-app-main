
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
        if (!username) {
          console.log("No username provided to usePlanData hook");
          setLoading(false);
          return;
        }
        
        console.log(`Fetching plan data for username: ${username}`);
        setLoading(true);
        
        // Mock data for now, could be replaced with API call
        setTimeout(() => {
          // Case-insensitive match for usernames
          const normalizedUsername = username.toLowerCase();
          console.log(`Normalized username for lookup: ${normalizedUsername}`);
          
          // Check if this is a recognized username
          if (normalizedUsername === 'decora') {
            const mockData: PlanData = {
              id: '123',
              username: username,
              company_name: 'Decora Agency',
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
            
            console.log("Plan data successfully fetched:", mockData.company_name);
            setPlanData(mockData);
          } else {
            console.log(`No plan data found for username: ${username}`);
            setPlanData(null);
          }
          
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
