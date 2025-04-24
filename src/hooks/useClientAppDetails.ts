
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { usePlanData, PlanDataType } from '@/hooks/usePlanData';
import { useClientDetails } from '@/hooks/client/useClientDetails';
import { ClientData } from '@/types/client.types';

interface ClientAppDetailsResult {
  appData: PlanDataType | null;
  clientData: ClientData | null;
  loading: boolean;
  error: Error | null;
}

const mockAppData = (businessName: string): PlanDataType => {
  // Generate consistent mock data based on business name
  const mockTemplates = {
    gym: {
      app_name: 'FitFlow Manager',
      description: 'A comprehensive gym management platform with member tracking, class scheduling, and payment processing.',
      features: [
        'Member Management & Tracking',
        'Class Scheduling System',
        'Payment Processing',
        'Attendance Tracking',
        'Performance Analytics'
      ],
      estimated_cost: 7500,
      estimated_days: 45,
      industry_type: 'fitness'
    },
    agency: {
      app_name: 'Agency Suite Pro',
      description: 'All-in-one agency management platform for client relationships, project tracking, and resource allocation.',
      features: [
        'Client Portal',
        'Project Management',
        'Resource Allocation',
        'Time Tracking',
        'Invoicing System'
      ],
      estimated_cost: 12000,
      estimated_days: 60,
      industry_type: 'agency'
    },
    default: {
      app_name: 'Business Management Suite',
      description: 'Custom business management solution tailored to streamline operations and boost efficiency.',
      features: [
        'User Management',
        'Dashboard Analytics',
        'Task Management',
        'Reporting System',
        'Client Communication'
      ],
      estimated_cost: 5000,
      estimated_days: 30,
      industry_type: 'business'
    }
  };

  // Determine template based on business name
  let template = mockTemplates.default;
  if (businessName.toLowerCase().includes('gym') || businessName.toLowerCase().includes('fitness')) {
    template = mockTemplates.gym;
  } else if (businessName.toLowerCase().includes('agency') || businessName.toLowerCase().includes('studio')) {
    template = mockTemplates.agency;
  }

  return {
    id: crypto.randomUUID(),
    username: businessName.toLowerCase().replace(/\s+/g, '-'),
    company_name: businessName,
    app_name: template.app_name,
    description: template.description,
    features: template.features,
    branding: {
      primary_color: '#3182CE',
      secondary_color: '#805AD5'
    },
    estimated_cost: template.estimated_cost,
    estimated_days: template.estimated_days,
    status: Math.random() > 0.5 ? 'active' : 'completed',
    industry_type: template.industry_type
  };
};

export function useClientAppDetails(clientId?: string | null): ClientAppDetailsResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  
  // Use existing hooks to fetch data
  const { clientData, loading: clientLoading } = useClientDetails(clientId);
  const { planData, loading: planLoading, error: planError } = usePlanData(username);

  // Generate mock data when real data is not found
  useEffect(() => {
    if (clientData && !planData && !planLoading) {
      const mockData = mockAppData(clientData.business_name || 'Default Business');
      setUsername(mockData.username);
    }
  }, [clientData, planData, planLoading]);

  // Find the username from client data for plans lookup
  useEffect(() => {
    const fetchUsername = async () => {
      if (!clientId) return;
      
      try {
        // Try to find a corresponding plan by looking up the client ID
        const { data, error } = await supabase
          .from('client_user_links')
          .select('user_id')
          .eq('client_id', clientId)
          .maybeSingle();
          
        if (error) {
          console.error('Error fetching user link:', error);
          return;
        }
        
        if (data?.user_id) {
          // Now get the profile for this user
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', data.user_id)
            .maybeSingle();
            
          if (profileError) {
            console.error('Error fetching profile:', profileError);
            return;
          }
          
          // Use client business name as username for plan lookup
          if (clientData?.business_name) {
            const formattedUsername = clientData.business_name.toLowerCase().replace(/\s+/g, '-');
            setUsername(formattedUsername);
          }
        }
      } catch (err) {
        console.error('Error in fetchUsername:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    if (clientData && !username) {
      fetchUsername();
    }
  }, [clientId, clientData, username]);

  // Combine loading states
  useEffect(() => {
    setLoading(clientLoading || planLoading || !username);
    
    if (planError) {
      setError(planError);
    }
  }, [clientLoading, planLoading, username, planError]);

  return {
    appData: planData || (clientData ? mockAppData(clientData.business_name || 'Default Business') : null),
    clientData,
    loading,
    error
  };
}
