
import { supabase } from '@/integrations/supabase/client';

// Helper function to generate random data for client onboarding
export const updateExistingClientData = async (): Promise<boolean> => {
  try {
    // First check if there are any existing clients
    const { data: existingClients, error: fetchError } = await supabase
      .from('client_onboarding')
      .select('id')
      .limit(1);
      
    if (fetchError) {
      console.error('Error checking existing clients:', fetchError);
      return false;
    }
    
    // If we already have clients, no need to create sample data
    if (existingClients && existingClients.length > 0) {
      console.log('Client data already exists, skipping sample data creation');
      return true;
    }
    
    // Sample client data
    const sampleClients = [
      {
        contact_name: 'John Smith',
        company_name: 'Gritness Gym',
        status: 'active',
        company_niche: 'Fitness',
        project_name: 'Gym Management Platform',
        website_url: 'https://gritnessgym.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'David Wilson',
        company_name: 'NM Construction',
        status: 'active',
        company_niche: 'Construction',
        project_name: 'Project Management Portal',
        website_url: 'https://nm-construction.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'Alex Johnson',
        company_name: 'OPTIMAL CONSTRUCTION',
        status: 'active',
        company_niche: 'Construction',
        project_name: 'Maintenance Management System',
        website_url: 'https://optimal-building-maintenance.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'Mark Taylor',
        company_name: 'UbahCryp',
        status: 'active',
        company_niche: 'Web3',
        project_name: 'Trading Platform',
        website_url: 'https://ubahcrypcom.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'Jennifer Lee',
        company_name: 'Elementree',
        status: 'active',
        company_niche: 'Restaurant',
        project_name: 'Management System',
        website_url: 'https://elementree.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'Ibrahim Khan',
        company_name: 'Trojan MMA',
        status: 'active',
        company_niche: 'Martial Arts',
        project_name: 'Gym Management Platform',
        website_url: 'https://trojan-mma.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'Steven Parker',
        company_name: 'Lets Go',
        status: 'active',
        company_niche: 'Social',
        project_name: 'Event Planning App',
        website_url: 'https://lets-go-u7hh.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'Michael Chen',
        company_name: 'Mu Shin',
        status: 'active',
        company_niche: 'Martial Arts',
        project_name: 'Self Defense Course Platform',
        website_url: 'https://siso-mu-shin.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'James Brown',
        company_name: '5 Star Hire',
        status: 'active',
        company_niche: 'Automotive',
        project_name: 'Car Hire Management System',
        website_url: 'https://5-star-hire.vercel.app/',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      }
    ];
    
    // Insert sample clients
    const { error: insertError } = await supabase
      .from('client_onboarding')
      .insert(sampleClients);
      
    if (insertError) {
      console.error('Error inserting sample clients:', insertError);
      return false;
    }
    
    console.log('Successfully created sample client data');
    return true;
  } catch (error) {
    console.error('Error in updateExistingClientData:', error);
    return false;
  }
};

// Helper function to make the current user an admin for easier testing
export const makeCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No authenticated user found');
      return false;
    }
    
    // Check if user already has admin role
    const { data: existingRole, error: checkError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking admin role:', checkError);
      return false;
    }
    
    // If already admin, return true
    if (existingRole) {
      console.log('User is already an admin');
      return true;
    }
    
    // Add admin role to user
    const { error: insertError } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role: 'admin' });
      
    if (insertError) {
      console.error('Error adding admin role:', insertError);
      return false;
    }
    
    console.log('Successfully made user an admin');
    return true;
  } catch (error) {
    console.error('Error in makeCurrentUserAdmin:', error);
    return false;
  }
};
