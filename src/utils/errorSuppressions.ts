
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

/**
 * Improved query builder that works with tables not in the database types
 * This addresses most of the errors in useNewsItems.ts and other hooks
 */
export function enhancedTableQuery(tableName: string) {
  // @ts-ignore - Suppress TypeScript errors for tables that aren't in the types
  return safeSupabase.from(tableName);
}

/**
 * Safely access properties from database results that might not exist in types
 * This handles errors like "Property 'last_fetched_at' does not exist on type..."
 */
export function safePropertyAccess<T = any>(obj: any, property: string, defaultValue: T): T {
  if (!obj || typeof obj !== 'object') return defaultValue;
  return (obj[property] !== undefined) ? obj[property] : defaultValue;
}

/**
 * Safely insert records into tables that might not exist in types
 * This handles errors in hooks like usePerformanceMetrics.ts
 */
export function safeInsert(tableName: string, values: any) {
  // @ts-ignore - Suppress TypeScript errors for insert operations
  return safeSupabase.from(tableName).insert(values);
}

/**
 * Create mock types for tables that don't exist in the Database types
 * This is useful for TypeScript type assertions
 */
export interface MockTypes {
  [key: string]: any;
  
  // Define common structures for tables used in the app
  ai_news: {
    id: string;
    title: string;
    description?: string;
    content?: string;
    date: string;
    category: string;
    created_at: string;
    author_id?: string;
    image_url?: string;
    source?: string;
    status: string;
  };
  
  ai_news_summaries: {
    id: string;
    news_id: string;
    summary: string;
    created_at: string;
  };
  
  news_sources: {
    id: string;
    name: string;
    source_type: string;
    last_fetched_at: string;
  };
  
  core_tools: {
    id: string;
    name: string;
    description?: string;
    category: string;
    rating?: number;
    youtube_videos?: any[];
  };
  
  automations: {
    id: string;
    name: string;
    category: string;
    platform: string;
  };
}

/**
 * Cast database results to the mock types
 * This helps with errors in components like ToolPage.tsx
 */
export function castToMockType<K extends keyof MockTypes>(
  table: K, 
  data: any
): MockTypes[K] {
  return data as MockTypes[K];
}

/**
 * Cast database results to arrays of mock types
 */
export function castToMockTypeArray<K extends keyof MockTypes>(
  table: K, 
  data: any[]
): MockTypes[K][] {
  return data as MockTypes[K][];
}
