
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { PlanData } from '@/contexts/plan/PlanContext';
import { supabase } from '@/integrations/supabase/client';

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
        
        // Special handling for "decora" username
        if (username.toLowerCase() === 'decora') {
          console.log("Using decora username - fetching plan data");
        }
        
        // Fetch from Supabase instead of using mock data
        const { data, error: supabaseError } = await supabase
          .from('plans')
          .select('*')
          .ilike('username', username)
          .maybeSingle();
        
        if (supabaseError) {
          console.error('Error fetching plan data:', supabaseError);
          throw supabaseError;
        }
        
        if (data) {
          console.log("Plan data successfully fetched:", data);
          
          // Transform data to match PlanData interface
          const planData: PlanData = {
            id: data.id,
            username: data.username,
            company_name: data.company_name,
            app_name: data.app_name,
            features: data.features,
            branding: data.branding as PlanData['branding'],
            estimated_cost: data.estimated_cost,
            estimated_days: data.estimated_days,
            status: data.status,
            created_at: data.created_at
          };
          
          setPlanData(planData);
          setError(null);
        } else {
          console.log(`No plan data found for username: ${username}`);
          setPlanData(null);
          setError(`No plan found for "${username}"`);
          
          // Show toast when plan is not found, but don't redirect
          toast({
            title: "Plan not found",
            description: `We couldn't find a plan for username "${username}".`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching plan data:', error);
        setError("Failed to load plan data");
        toast({
          title: "Error loading plan",
          description: "Could not load the plan data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlanData();
  }, [username, toast]);

  return { loading, planData, setPlanData, setLoading, error };
};
