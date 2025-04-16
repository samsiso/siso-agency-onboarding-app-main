
import { supabase } from '@/integrations/supabase/client';

// Update existing client data with missing fields
export const updateExistingClientData = async () => {
  try {
    // Find clients that may have null values for key fields
    const { data: clients, error } = await supabase
      .from('client_onboarding')
      .select('*')
      .or('company_name.is.null,contact_name.is.null');
    
    if (error) {
      console.error('Error fetching clients:', error);
      return false;
    }
    
    // No clients to update
    if (!clients || clients.length === 0) {
      return true;
    }
    
    // Update each client with placeholder data if needed
    for (const client of clients) {
      const updates: any = {};
      
      if (!client.contact_name) {
        updates.contact_name = 'Unknown Contact';
      }
      
      if (!client.company_name) {
        updates.company_name = 'Unnamed Company';
      }
      
      if (!client.project_name) {
        updates.project_name = client.company_name || 'New Project';
      }
      
      if (Object.keys(updates).length > 0) {
        const { error: updateError } = await supabase
          .from('client_onboarding')
          .update(updates)
          .eq('id', client.id);
        
        if (updateError) {
          console.error(`Error updating client ${client.id}:`, updateError);
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating client data:', error);
    return false;
  }
};

// Add the current user to admin role
export const makeCurrentUserAdmin = async (): Promise<boolean> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    
    // Check if already admin
    const { data: existingRole } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();
    
    if (existingRole) {
      console.log('User is already an admin');
      return true;
    }
    
    // Add admin role
    const { error } = await supabase
      .from('user_roles')
      .insert({ user_id: user.id, role: 'admin' });
    
    if (error) {
      console.error('Error adding admin role:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error making user admin:', error);
    return false;
  }
};
