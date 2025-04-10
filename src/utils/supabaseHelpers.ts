
import { supabase } from '@/integrations/supabase/client';

// Create a wrapper around the supabase client to safely query tables
// that may not be included in the generated types
export const safeSupabase = {
  from: (tableName: string) => {
    // Use type casting to bypass TypeScript's type checking constraints
    return supabase.from(tableName) as any;
  }
};

/**
 * Helper function for safely accessing JSON properties
 * @param obj The object to access properties from
 * @param key The key to access
 * @param defaultValue Default value if the property doesn't exist
 */
export function safeJsonAccess<T>(obj: any, key: string, defaultValue: T): T {
  if (!obj || typeof obj !== 'object') return defaultValue;
  
  try {
    // For JSON strings that might be parsed
    if (typeof obj === 'string') {
      try {
        const parsed = JSON.parse(obj);
        return parsed[key] !== undefined ? parsed[key] : defaultValue;
      } catch (e) {
        return defaultValue;
      }
    }
    
    // For regular objects
    return obj[key] !== undefined ? obj[key] : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}
