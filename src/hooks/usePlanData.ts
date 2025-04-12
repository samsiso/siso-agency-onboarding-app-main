
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlanData } from '@/contexts/plan/PlanContext';

export const usePlanData = (username: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        if (!username) {
          console.log("No username provided to usePlanData hook");
          setLoading(false);
          setError("No username provided");
          return;
        }
        
        console.log(`Fetching plan data for username: ${username}`);
        setLoading(true);
        setError(null);
        
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
            setError(null);
          } else {
            console.log(`No plan data found for username: ${username}`);
            setPlanData(null);
            setError(`No plan found for "${username}"`);
            
            // Show toast when plan is not found
            toast({
              title: "Plan not found",
              description: `We couldn't find a plan for username "${username}".`,
              variant: "destructive"
            });
          }
          
          setLoading(false);
        }, 1500);
        
      } catch (error) {
        console.error('Error fetching plan data:', error);
        setError("Failed to load plan data");
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

  return { loading, planData, setPlanData, setLoading, error };
};
