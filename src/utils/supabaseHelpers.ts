
import { supabase } from '@/integrations/supabase/client';

// Create a "safe" version of supabase that handles common errors
export const safeSupabase = {
  // Pass through auth methods
  auth: supabase.auth,
  
  // Pass through real-time subscription methods
  channel: (name: string) => supabase.channel(name),
  removeChannel: (channel: any) => supabase.removeChannel(channel),
  
  // Enhanced from method with additional typings
  from: (table: string) => {
    return supabase.from(table as any);
  },
  
  // Pass through functions
  functions: supabase.functions,
  
  // For direct storage access
  storage: supabase.storage
};

// Helper function for safely casting data from the database
export function safeCast<T = any>(data: any): T {
  return data as T;
}

// Helper function to check if the current user is an admin
export const checkIsAdmin = async (): Promise<boolean> => {
  try {
    console.log('Checking admin status...');
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) {
      console.error('Auth error during admin check:', userError);
      return false;
    }
    
    if (!user) {
      console.log('No user found during admin check');
      return false;
    }

    console.log('Checking admin status for user:', user.id, user.email);
    
    // Add debug information - log all roles for this user
    const { data: allRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id);
      
    if (rolesError) {
      console.error('Error fetching all roles:', rolesError);
    } else {
      console.log('All user roles:', allRoles);
    }
    
    // Query the user_roles table to check if the user is an admin
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error checking admin role:', error.message);
      return false;
    }

    const isAdmin = !!data;
    console.log('Admin check result:', isAdmin, 'Role data:', data);
    
    return isAdmin;
  } catch (error) {
    console.error('Unexpected error checking admin status:', error);
    return false;
  }
};

// Helper function to add a user to the admin role
export const addUserToAdminRole = async (userId: string): Promise<boolean> => {
  try {
    console.log('Adding user to admin role:', userId);
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role: 'admin' }]);
      
    if (error) {
      console.error('Error adding user to admin role:', error);
      return false;
    }
      
    console.log('Successfully added user to admin role');
    return true;
  } catch (error) {
    console.error('Error adding user to admin role:', error);
    return false;
  }
};

// Helper function to safely access properties from potentially undefined objects
export function safeGet<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null) {
      return defaultValue;
    }
    current = current[key];
  }
  
  return (current === undefined || current === null) ? defaultValue : current as T;
}
