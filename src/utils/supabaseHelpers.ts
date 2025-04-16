
import { supabase } from '@/integrations/supabase/client';

// Create a "safe" version of supabase that handles common errors
export const safeSupabase = {
  from: (table: string) => {
    return {
      ...supabase.from(table),
      select: (query: string, options?: any) => {
        const selectQuery = supabase.from(table).select(query, options);
        return selectQuery;
      }
    };
  }
};

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
