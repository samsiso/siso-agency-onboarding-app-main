
import { ClientData } from '@/types/client.types';
import { safePropertyAccess } from '@/utils/errorSuppressions';

/**
 * Process client detail data from the API response to ClientData format
 */
export const processClientDetail = (data: any, clientId: string): ClientData => {
  // Safely extract profile data with a default empty object
  const profileData = data.profiles || {};
  
  // Process the data to get a flattened structure
  const clientData: ClientData = {
    id: data.id || clientId,
    status: safePropertyAccess(data, 'status', 'pending'),
    current_step: safePropertyAccess(data, 'current_step', 1),
    total_steps: safePropertyAccess(data, 'total_steps', 5),
    completed_steps: Array.isArray(safePropertyAccess(data, 'completed_steps', [])) 
      ? safePropertyAccess(data, 'completed_steps', []) 
      : [],
    created_at: safePropertyAccess(data, 'created_at', new Date().toISOString()),
    updated_at: safePropertyAccess(data, 'updated_at', new Date().toISOString()),
    full_name: safePropertyAccess(profileData, 'full_name', 'Unknown'),
    email: safePropertyAccess(profileData, 'email', null),
    business_name: safePropertyAccess(profileData, 'business_name', null),
    avatar_url: safePropertyAccess(profileData, 'avatar_url', null),
    phone: safePropertyAccess(profileData, 'phone', null),
    // Additional fields for the detailed view
    website_url: safePropertyAccess(profileData, 'website_url', null),
    professional_role: safePropertyAccess(profileData, 'professional_role', null),
    bio: safePropertyAccess(profileData, 'bio', null),
    // Project-related fields
    project_name: null,
    company_niche: null,
    development_url: null,
    mvp_build_status: null,
    notion_plan_url: null,
    payment_status: null,
    estimated_price: null,
    initial_contact_date: null,
    start_date: null,
    estimated_completion_date: null,
  };
  
  return clientData;
};

/**
 * Helper function to create a default client data object with minimal required fields
 */
export function createDefaultClientData(clientId: string): ClientData {
  return {
    id: clientId,
    status: 'pending',
    current_step: 1,
    total_steps: 5,
    completed_steps: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    full_name: 'Unknown',
    email: null,
    business_name: null,
    avatar_url: null,
    phone: null,
    website_url: null,
    professional_role: null,
    bio: null,
    project_name: null,
    company_niche: null,
    development_url: null,
    mvp_build_status: null,
    notion_plan_url: null,
    payment_status: null,
    estimated_price: null,
    initial_contact_date: null,
    start_date: null,
    estimated_completion_date: null,
  };
}
