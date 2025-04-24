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

const getMockAppData = (userId: string): PlanDataType => {
  // Generate consistent mock data based on user ID
  const mockData = {
    'user-1': {
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
      status: 'active'
    },
    'user-2': {
      app_name: 'CreatorHub Studio',
      description: 'All-in-one content creator management platform for OnlyFans creators and agencies.',
      features: [
        'Content Calendar',
        'Analytics Dashboard',
        'Automated Scheduling',
        'Revenue Tracking',
        'Chat Management'
      ],
      estimated_cost: 12000,
      estimated_days: 60,
      status: 'in_progress'
    },
    'user-3': {
      app_name: 'Agency Suite Pro',
      description: 'Complete agency management solution for digital marketing and creative agencies.',
      features: [
        'Project Management',
        'Client Portal',
        'Team Collaboration',
        'Resource Planning',
        'Invoicing System'
      ],
      estimated_cost: 9500,
      estimated_days: 50,
      status: 'completed'
    }
  };

  const defaultData = {
    app_name: 'Custom Business Suite',
    description: 'Tailored business management platform designed to streamline operations and boost efficiency.',
    features: [
      'User Management',
      'Dashboard Analytics',
      'Task Management',
      'Reporting System',
      'Client Communication'
    ],
    estimated_cost: 5000,
    estimated_days: 30,
    status: 'pending'
  };

  const mockEntry = mockData[userId as keyof typeof mockData] || defaultData;

  return {
    id: userId,
    username: userId,
    company_name: `Company ${userId.split('-')[1]}`,
    ...mockEntry,
    branding: {
      primary_color: '#3182CE',
      secondary_color: '#805AD5'
    },
    industry_type: 'software'
  };
};

const getMockClientData = (userId: string): ClientData => {
  return {
    id: userId,
    full_name: `Demo User ${userId.split('-')[1]}`,
    email: `user${userId.split('-')[1]}@example.com`,
    business_name: `Business ${userId.split('-')[1]}`,
    phone: null,
    avatar_url: null,
    status: 'active',
    current_step: 3,
    total_steps: 5,
    completed_steps: ['setup', 'design', 'development'],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    website_url: null,
    professional_role: 'Business Owner',
    bio: null,
    project_name: null,
    company_niche: 'Technology',
    development_url: null,
    mvp_build_status: null,
    notion_plan_url: null,
    payment_status: null,
    estimated_price: null,
    initial_contact_date: null,
    start_date: null,
    estimated_completion_date: null,
    todos: [],
    next_steps: null,
    key_research: null,
    priority: null,
    contact_name: null,
    company_name: null
  };
};

export function useClientAppDetails(clientId?: string | null): ClientAppDetailsResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [username, setUsername] = useState<string | undefined>(undefined);
  
  // Use existing hooks
  const { clientData: realClientData, loading: clientLoading } = useClientDetails(clientId);
  const { planData, loading: planLoading } = usePlanData(username);

  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      setError(new Error('No client ID provided'));
      return;
    }

    // For mock data (user-1, user-2, etc), skip the real data fetch
    if (clientId.startsWith('user-')) {
      setUsername(clientId);
      setLoading(false);
      return;
    }

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
          if (realClientData?.business_name) {
            const formattedUsername = realClientData.business_name.toLowerCase().replace(/\s+/g, '-');
            setUsername(formattedUsername);
          }
        }
      } catch (err) {
        console.error('Error in fetchUsername:', err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    };

    if (realClientData && !username) {
      fetchUsername();
    }
  }, [clientId, realClientData, username]);

  // Combine loading states
  useEffect(() => {
    setLoading(clientLoading || planLoading || !username);
    
  }, [clientLoading, planLoading, username]);

  return {
    // If it's a mock user ID, return mock data, otherwise use real data
    appData: clientId?.startsWith('user-') ? getMockAppData(clientId) : planData,
    clientData: clientId?.startsWith('user-') ? getMockClientData(clientId) : realClientData,
    loading: loading || (clientLoading && planLoading),
    error
  };
}
