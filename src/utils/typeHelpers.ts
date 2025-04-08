
import { supabase } from "@/integrations/supabase/client";

/**
 * Helper function to handle TypeScript errors when querying tables not defined in the Database type.
 * This is a temporary solution until proper types are generated from the Supabase schema.
 * 
 * @param tableName The name of the table to query
 * @returns A typed query builder for the specified table
 */
export function safeQuery(tableName: string) {
  // We use type assertion to bypass TypeScript's type checking
  // This is not ideal, but is a pragmatic workaround until complete types are generated
  return supabase.from(tableName) as any;
}

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
