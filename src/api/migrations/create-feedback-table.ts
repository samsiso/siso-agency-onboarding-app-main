import { supabase } from '@/lib/supabase';
import createFeedbackTableSQL from './create-feedback-table.sql?raw';

export async function createFeedbackTable() {
  try {
    // Check if the table already exists
    const { data: tableExists, error: checkError } = await supabase
      .from('project_feedback')
      .select('id')
      .limit(1);
    
    if (checkError && !checkError.message.includes('does not exist')) {
      console.error('Error checking if feedback table exists:', checkError);
      return { success: false, error: checkError };
    }
    
    // If table already exists, skip migration
    if (tableExists && tableExists.length > 0) {
      console.log('Feedback table already exists, skipping migration');
      return { success: true };
    }
    
    // Run the SQL migration
    const { error } = await supabase.rpc('pg_execute', { 
      query: createFeedbackTableSQL 
    });
    
    if (error) {
      console.error('Error creating feedback table:', error);
      return { success: false, error };
    }
    
    console.log('Feedback table migration completed successfully!');
    return { success: true };
  } catch (error) {
    console.error('Unexpected error during feedback table migration:', error);
    return { success: false, error };
  }
} 