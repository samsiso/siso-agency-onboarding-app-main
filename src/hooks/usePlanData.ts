
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PlanDataType {
  id: string;
  username: string;
  company_name: string | null;
  app_name: string | null;
  description: string | null; // Added description property
  features: string[] | null;
  branding: {
    logo?: string;
    primary_color?: string;
    secondary_color?: string;
  } | null;
  estimated_cost: number | null;
  estimated_days: number | null;
  status: string | null;
  industry_type?: string;
}

export function usePlanData(username: string | undefined) {
  const [loading, setLoading] = useState<boolean>(true);
  const [planData, setPlanData] = useState<PlanDataType | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const isMounted = useRef(true);
  
  useEffect(() => {
    // Set up cleanup function to prevent state updates after unmounting
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  useEffect(() => {
    const fetchPlanData = async () => {
      if (!username) {
        if (isMounted.current) {
          setLoading(false);
          setError(new Error("No username provided"));
        }
        return;
      }
      
      try {
        if (isMounted.current) {
          setLoading(true);
          setError(null);
        }
        
        // Fetch plan data from Supabase
        const { data, error } = await supabase
          .from('plans')
          .select('*')
          .eq('username', username)
          .single();
        
        if (error) {
          console.error('Error fetching plan:', error);
          
          // If no plan found in database, fall back to mock data
          const mockData: PlanDataType = {
            id: '123',
            username: username,
            company_name: username === 'decora' ? 'Decora Agency' : 'Siso Agency',
            app_name: 'OnlyFans Management Suite',
            description: 'A comprehensive platform to manage OnlyFans content, analytics, and client relationships.',
            features: ['Content Management', 'Analytics Dashboard', 'Client Portal', 'Messaging System'],
            branding: {
              primary_color: '#3182CE',
              secondary_color: '#805AD5'
            },
            estimated_cost: 4997,
            estimated_days: 14,
            status: 'draft',
            industry_type: username === 'decora' ? 'onlyfans-management' : 'digital-marketing'
          };
          
          if (isMounted.current) {
            setPlanData(mockData);
            setLoading(false);
          }
        } else {
          if (isMounted.current) {
            // Convert the branding to the correct format if needed
            const formattedData: PlanDataType = {
              ...data,
              description: data.description || null,
              branding: typeof data.branding === 'string' 
                ? JSON.parse(data.branding) 
                : data.branding
            };
            
            setPlanData(formattedData);
            setLoading(false);
          }
        }
        
      } catch (error) {
        console.error('Error in fetchPlanData:', error);
        if (isMounted.current) {
          setError(error instanceof Error ? error : new Error(String(error)));
          setLoading(false);
        }
      }
    };
    
    fetchPlanData();
  }, [username]);
  
  return { loading, planData, error };
}
