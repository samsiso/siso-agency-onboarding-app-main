
import { supabase } from "@/integrations/supabase/client";

/**
 * Safely access a property from an object with a default value if it doesn't exist
 * This helps prevent TypeErrors when accessing nested properties that might be undefined
 */
export function safePropertyAccess<T>(obj: any, path: string, defaultValue: T): T {
  if (!obj) return defaultValue;
  
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === undefined || current === null || typeof current !== 'object') {
      return defaultValue;
    }
    current = current[key];
  }
  
  return (current === undefined || current === null) ? defaultValue : current as T;
}

/**
 * Mock types for tables that don't exist in the Database type
 * This helps with TypeScript errors when dealing with tables not in the schema
 */
export interface MockTypes {
  ai_news: {
    id: string;
    title: string;
    description?: string;
    content?: string;
    date?: string;
    category?: string;
    created_at: string;
    status?: string;
  };
  ai_news_summaries: {
    id: string;
    news_id: string;
    summary: string;
    created_at: string;
  };
  core_tools: {
    id: string;
    name: string;
    description?: string;
    category?: string;
    rating?: number;
    downloads_count?: number;
    created_at?: string;
    youtube_videos?: any[];
  };
}

/**
 * Enhanced query function for tables not in the Database type
 * This helps bypass TypeScript errors for tables that don't exist in the Database type
 */
export function enhancedTableQuery(tableName: string) {
  return supabase.from(tableName);
}

/**
 * Type-safe table query function
 * This helps with tables that are not in the Database type
 */
export function safeTableQuery(tableName: string) {
  return supabase.from(tableName);
}

/**
 * Cast data to a specific mock type
 * This helps with tables not in the Database type
 */
export function castToMockType<K extends keyof MockTypes>(data: any): MockTypes[K] {
  return data as MockTypes[K];
}

/**
 * Cast array data to a specific mock type array
 * This helps with arrays of data from tables not in the Database type
 */
export function castToMockTypeArray<K extends keyof MockTypes>(data: any[]): MockTypes[K][] {
  return data as MockTypes[K][];
}
