
import { supabase } from "@/integrations/supabase/client";
import { safeSupabase } from "./supabaseHelpers";
import FeatureFlags from "./featureFlags";

/**
 * Helper function to handle TypeScript errors when querying tables not defined in the Database type.
 * Uses the feature flags to determine whether to use the real supabase client or the mock client.
 * 
 * @param tableName The name of the table to query
 * @param feature The feature flag to check (optional)
 * @returns A typed query builder for the specified table
 */
export function safeQuery<T = any>(tableName: string, feature?: keyof typeof FeatureFlags) {
  // If a feature is specified and disabled, use the mock client
  if (feature && !FeatureFlags[feature]) {
    console.log(`Feature ${feature} is disabled. Using mock data for ${tableName}`);
    return safeSupabase.from(tableName) as any;
  }
  
  // Types for the tables that may not exist in the Database type
  const customTables = [
    'ai_news', 
    'ai_news_summaries', 
    'ai_news_daily_summaries',
    'ai_news_video_processing',
    'ai_news_bookmarks', 
    'news_sources',
    'core_tools',
    'automations',
    'performance_metrics',
    // Add other tables that cause type errors here
  ];

  // If the table is a custom table, use type assertion to bypass TypeScript's checks
  if (customTables.includes(tableName)) {
    console.log(`Using safeQuery for custom table: ${tableName}`);
    return safeSupabase.from(tableName) as any;
  }
  
  // Otherwise use the real client with type assertion
  // Use the any type to bypass TypeScript's strict checking
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

/**
 * Safely cast data to a specific type when the structure doesn't match exactly
 * This helps with tables that don't exist in the database but we need to type them
 * 
 * @param data Any data structure
 * @returns The data cast to the specified type
 */
export function safeCast<T>(data: any): T {
  return data as unknown as T;
}

/**
 * Safe property access for nested objects that might not exist
 * Especially useful for response data from endpoints
 * 
 * @param obj The object to access properties from
 * @param path The path to the desired property (e.g., "user.profile.name")
 * @param defaultValue Default value to return if property doesn't exist
 */
export function safePropertyAccess<T>(obj: any, path: string, defaultValue: T): T {
  try {
    const keys = path.split('.');
    let current = obj;
    
    for (const key of keys) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return defaultValue;
      }
      current = current[key];
    }
    
    return current !== undefined && current !== null ? current : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Type guard to check if an object is a Supabase error
 */
export function isSupabaseError(obj: any): boolean {
  return obj && typeof obj === 'object' && 'code' in obj && 'message' in obj;
}
