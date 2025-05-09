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
    // Portfolio projects from the leaderboard
    '1': {
      app_name: 'Optimal Construction',
      description: 'Building maintenance and construction services with a focus on commercial properties.',
      features: [
        'Project Management Dashboard',
        'Service Scheduling',
        'Cost Estimation',
        'Maintenance Tracking',
        'Client Portal'
      ],
      estimated_cost: 15000,
      estimated_days: 60,
      status: 'in_progress',
      website_url: 'https://optimal-building-maintenance.vercel.app/',
      client_engagement: 60,
      completion_percentage: 50
    },
    '2': {
      app_name: 'UbahCryp',
      description: 'A cryptocurrency trading platform built with React and Web3 technologies.',
      features: [
        'Real-time Trading Interface',
        'Wallet Integration',
        'Market Analytics',
        'Portfolio Management',
        'Transaction History'
      ],
      estimated_cost: 5000,
      estimated_days: 30,
      status: 'completed',
      website_url: 'https://ubahcrypcom.vercel.app/',
      client_engagement: 90,
      completion_percentage: 100
    },
    '3': {
      app_name: 'Gritness',
      description: 'A gym management and fitness tracking application with personalized workout plans.',
      features: [
        'Member Management',
        'Workout Tracking',
        'Nutrition Planning',
        'Progress Analytics',
        'Class Scheduling'
      ],
      estimated_cost: 249,
      estimated_days: 25,
      status: 'in_progress',
      website_url: 'https://gritnessgym.vercel.app/',
      client_engagement: 40,
      completion_percentage: 75
    },
    '4': {
      app_name: 'Trojan MMA',
      description: 'MMA gym and training center website with membership management and class scheduling.',
      features: [
        'Member Portal',
        'Class Registration',
        'Instructor Profiles',
        'Event Calendar',
        'Payment Processing'
      ],
      estimated_cost: 249,
      estimated_days: 20,
      status: 'in_progress',
      website_url: 'https://trojan-mma.vercel.app/',
      client_engagement: 35,
      completion_percentage: 60
    },
    '5': {
      app_name: 'Lets Go',
      description: 'Travel and adventure booking platform with itinerary planning and group bookings.',
      features: [
        'Trip Planning',
        'Booking Management',
        'User Reviews',
        'Payment Processing',
        'Travel Recommendations'
      ],
      estimated_cost: 249,
      estimated_days: 30,
      status: 'nearly_completed',
      website_url: 'https://lets-go-u7hh.vercel.app/',
      client_engagement: 80,
      completion_percentage: 90
    },
    '6': {
      app_name: 'NM Construction',
      description: 'Construction company website with project portfolio and service booking.',
      features: [
        'Project Showcase',
        'Quote Generator',
        'Service Booking',
        'Team Profiles',
        'Client Testimonials'
      ],
      estimated_cost: 0,
      estimated_days: 40,
      status: 'in_progress',
      website_url: 'https://nm-construction.vercel.app/',
      client_engagement: 50,
      completion_percentage: 45
    },
    '7': {
      app_name: 'Elementree',
      description: 'Arborist and tree care services website with booking system and maintenance tracking.',
      features: [
        'Service Scheduling',
        'Tree Inventory',
        'Maintenance Records',
        'Quote Generation',
        'Emergency Services'
      ],
      estimated_cost: 0,
      estimated_days: 35,
      status: 'in_progress',
      website_url: 'https://elementree.vercel.app/',
      client_engagement: 30,
      completion_percentage: 55
    },
    '8': {
      app_name: 'Mu Shin',
      description: 'Martial arts school and training center website with online class booking.',
      features: [
        'Class Scheduling',
        'Online Tutorials',
        'Membership Management',
        'Belt Progression Tracking',
        'Event Calendar'
      ],
      estimated_cost: 0,
      estimated_days: 25,
      status: 'declined',
      website_url: 'https://siso-mu-shin.vercel.app/',
      client_engagement: 20,
      completion_percentage: 100
    },
    '9': {
      app_name: '5 Star Hire',
      description: 'Equipment hire and rental service with inventory management and booking system.',
      features: [
        'Equipment Inventory',
        'Online Booking',
        'Payment Processing',
        'Maintenance Tracking',
        'Delivery Scheduling'
      ],
      estimated_cost: 0,
      estimated_days: 30,
      status: 'early_progress',
      website_url: 'https://5-star-hire.vercel.app/',
      client_engagement: 25,
      completion_percentage: 35
    },
    '10': {
      app_name: 'Keegan Saas',
      description: 'SaaS platform for business management with CRM, project tracking, and analytics.',
      features: [
        'Customer Management',
        'Project Tracking',
        'Analytics Dashboard',
        'Task Management',
        'Reporting Tools'
      ],
      estimated_cost: 0,
      estimated_days: 60,
      status: 'not_started',
      website_url: '',
      client_engagement: 15,
      completion_percentage: 0
    },
    // Original demo data
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

export const useClientAppDetails = (clientId?: string | null): ClientAppDetailsResult => {
  const [result, setResult] = useState<ClientAppDetailsResult>({
    appData: null,
    clientData: null,
    loading: true,
    error: null
  });

  const { data: planData } = usePlanData();
  const { client: supabaseClient } = useClientDetails();

  useEffect(() => {
    if (!clientId) {
      setResult({
        appData: null,
        clientData: null,
        loading: false,
        error: new Error('No client ID provided')
      });
      return;
    }
    
    // Support direct numeric IDs for our project cards (1-10)
    const isProjectCard = !isNaN(Number(clientId)) && Number(clientId) >= 1 && Number(clientId) <= 10;

    // For mock data (user-1, user-2, etc), skip the real data fetch
    if (clientId.startsWith('user-')) {
      const username = clientId;
      const appData = getMockAppData(clientId);
      const clientData = getMockClientData(clientId);
      setResult({
        appData,
        clientData,
        loading: false,
        error: null
      });
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
