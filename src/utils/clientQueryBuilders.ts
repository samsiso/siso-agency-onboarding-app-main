
import { supabase } from '@/integrations/supabase/client';
import { ClientData, ClientsListParams } from '@/types/client.types';
import { safePropertyAccess } from '@/utils/errorSuppressions';

/**
 * Builds a Supabase query for the client_onboarding table with filters and sorting
 */
export const buildClientListQuery = ({ 
  searchQuery = '', 
  statusFilter = 'all',
  sortColumn = 'updated_at',
  sortDirection = 'desc'
}: Partial<ClientsListParams>) => {
  let query = supabase
    .from('client_onboarding')
    .select(`
      *,
      profiles:user_id(
        id,
        full_name,
        email,
        business_name,
        avatar_url,
        phone,
        website_url,
        professional_role,
        bio
      )
    `);
  
  // Apply search filter if provided
  if (searchQuery) {
    query = query.or(`
      profiles.full_name.ilike.%${searchQuery}%,
      profiles.email.ilike.%${searchQuery}%,
      profiles.business_name.ilike.%${searchQuery}%
    `);
  }
  
  // Apply status filter if not 'all'
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  
  // Apply sorting
  const profileFields = [
    'full_name', 
    'email', 
    'business_name', 
    'avatar_url', 
    'phone', 
    'website_url',
    'professional_role',
    'bio'
  ];
  
  if (profileFields.includes(sortColumn)) {
    // For profile fields, we need to sort after fetching
    // This is a limitation of Supabase and joined tables
    // The actual sorting will happen in processClientData
  } else {
    // For direct fields, we can sort in the query
    query = query.order(sortColumn, { ascending: sortDirection === 'asc' });
  }
  
  return query;
};

/**
 * Process and flatten the client data from the joined tables
 */
export const processClientData = (data: any[]): ClientData[] => {
  return data.map(item => {
    const profileData = item.profiles || {};
    
    return {
      id: item.id,
      user_id: item.user_id,
      status: item.status,
      current_step: item.current_step,
      total_steps: item.total_steps,
      completed_steps: item.completed_steps || [],
      created_at: item.created_at,
      updated_at: item.updated_at,
      // Profile data
      full_name: safePropertyAccess(profileData, 'full_name', 'Unknown'),
      email: safePropertyAccess(profileData, 'email', null),
      business_name: safePropertyAccess(profileData, 'business_name', null),
      avatar_url: safePropertyAccess(profileData, 'avatar_url', null),
      phone: safePropertyAccess(profileData, 'phone', null),
      website_url: safePropertyAccess(profileData, 'website_url', null),
      professional_role: safePropertyAccess(profileData, 'professional_role', null),
      bio: safePropertyAccess(profileData, 'bio', null),
      // Additional fields we're adding to the model
      project_name: safePropertyAccess(item, 'project_name', null),
      company_niche: safePropertyAccess(item, 'company_niche', null),
      development_url: safePropertyAccess(item, 'development_url', null),
      mvp_build_status: safePropertyAccess(item, 'mvp_build_status', null),
      notion_plan_url: safePropertyAccess(item, 'notion_plan_url', null),
      payment_status: safePropertyAccess(item, 'payment_status', null),
      estimated_price: safePropertyAccess(item, 'estimated_price', null),
      initial_contact_date: safePropertyAccess(item, 'initial_contact_date', null),
      start_date: safePropertyAccess(item, 'start_date', null),
      estimated_completion_date: safePropertyAccess(item, 'estimated_completion_date', null),
    };
  });
};

/**
 * Build a more simplified query for fallback purposes
 */
export const buildFallbackClientQuery = ({ 
  searchQuery = '', 
  statusFilter = 'all'
}: Partial<ClientsListParams>) => {
  let query = supabase
    .from('client_onboarding')
    .select(`
      *,
      profiles:user_id(full_name, email, business_name, avatar_url, phone)
    `);
  
  // Apply status filter if not 'all'
  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }
  
  // Apply search filter if provided (simplified)
  if (searchQuery) {
    query = query.or(`profiles.full_name.ilike.%${searchQuery}%`);
  }
  
  return query;
};
