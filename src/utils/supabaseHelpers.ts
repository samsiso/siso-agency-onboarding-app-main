
import { supabase } from '@/integrations/supabase/client';
import { PostgrestFilterBuilder } from '@supabase/supabase-js';

// Create a "safe" version of supabase that handles common errors
export const safeSupabase = {
  // Pass through auth methods
  auth: supabase.auth,
  
  // Pass through real-time subscription methods
  channel: (name: string) => supabase.channel(name),
  removeChannel: (channel: any) => supabase.removeChannel(channel),
  
  // Enhanced from method with additional typings
  from: (table: string) => {
    const queryBuilder = supabase.from(table);
    
    return {
      ...queryBuilder,
      select: (query: string, options?: any) => {
        const selectQuery = supabase.from(table).select(query, options);
        return selectQuery;
      },
      insert: (values: any, options?: any) => {
        return supabase.from(table).insert(values, options);
      },
      update: (values: any, options?: any) => {
        return supabase.from(table).update(values, options);
      },
      delete: (options?: any) => {
        return supabase.from(table).delete(options);
      },
      // Add any other methods you need here
    };
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return !!data && !error;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

// Helper function to add a user to the admin role
export const addUserToAdminRole = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role: 'admin' }]);
      
    return !error;
  } catch (error) {
    console.error('Error adding user to admin role:', error);
    return false;
  }
};
