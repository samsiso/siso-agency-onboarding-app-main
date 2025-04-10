
/**
 * This file contains utility functions to safely handle operations
 * that might cause TypeScript errors due to missing tables/fields in the database types
 */

import { safeSupabase } from './supabaseHelpers';

/**
 * Safely perform database operations on tables that might not exist in the database schema types
 * Returns a mock response for disabled features to prevent runtime errors
 * 
 * @param tableName Table to query
 * @param isEnabled Feature flag to check
 * @returns Safe query builder
 */
export function safeTableQuery(tableName: string, isEnabled: boolean = true) {
  if (!isEnabled) {
    console.log(`Feature for table ${tableName} is disabled, using mock query`);
    // Return a minimal mock query implementation
    return {
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
        in: () => Promise.resolve({ data: [], error: null }),
        not: () => Promise.resolve({ data: [], error: null }),
        order: () => ({
          limit: () => Promise.resolve({ data: [], error: null }),
        }),
      }),
      insert: () => Promise.resolve({ data: null, error: null }),
      update: () => Promise.resolve({ data: null, error: null }),
      delete: () => Promise.resolve({ data: null, error: null }),
    };
  }
  
  // Use type assertion to bypass TypeScript strict typing
  return safeSupabase.from(tableName) as any;
}

/**
 * Type casting function to suppress type errors for disabled features
 * @param value Any value
 * @returns The same value cast to the requested type
 */
export function suppressTypeError<T>(value: any): T {
  return value as unknown as T;
}

/**
 * Create a mock result object with the specified properties
 * Useful for mocking database results
 */
export function createMockResult<T extends object>(properties: Partial<T>): T {
  return properties as T;
}

/**
 * Safe access to response data with type checking suppression
 */
export function safeResponseAccess<T>(response: any, defaultValue: T): T {
  if (!response || !response.data) return defaultValue;
  return response.data as T;
}
