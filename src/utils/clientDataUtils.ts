
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
        company_name: 'Tech Innovations',
        status: 'active',
        company_niche: 'SaaS',
        project_name: 'Customer Portal',
        website_url: 'https://techinnovations.example.com',
        current_step: 5,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope', 'design', 'review']
      },
      {
        contact_name: 'Sarah Johnson',
        company_name: 'Creative Agency Co',
        status: 'pending',
        company_niche: 'Marketing',
        project_name: 'Brand Redesign',
        website_url: 'https://creativeagency.example.com',
        current_step: 2,
        total_steps: 5,
        completed_steps: ['intro', 'details']
      },
      {
        contact_name: 'Michael Brown',
        company_name: 'Retail Solutions',
        status: 'in_progress',
        company_niche: 'E-commerce',
        project_name: 'Inventory System',
        website_url: 'https://retailsolutions.example.com',
        current_step: 3,
        total_steps: 5,
        completed_steps: ['intro', 'details', 'scope']
      },
      {
        contact_name: 'Emily Chen',
        company_name: 'Health Services',
        status: 'proposal',
        company_niche: 'Healthcare',
        project_name: 'Patient Portal',
        website_url: 'https://healthservices.example.com',
        current_step: 1,
        total_steps: 5,
        completed_steps: ['intro']
      },
      {
        contact_name: 'David Wilson',
        company_name: 'Financial Advisors',
        status: 'completed',
        company_niche: 'Finance',
        project_name: 'Investment Dashboard',
        website_url: 'https://financialadvisors.example.com',
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
