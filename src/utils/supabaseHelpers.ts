
import { supabase } from '@/integrations/supabase/client';

// List of tables that are used in the app but might not exist in the database yet
const MOCK_TABLES = [
  'news_comments',
  'wallet_nonces',
  'user_crypto_history',
  'crypto_transactions',
  'welcome_nft_mints',
  'point_configurations',
  'project_documentation',
  'video_progress',
  'leaderboard',
  'ai_news_bookmarks',
  'ai_news',
  'ai_news_summaries',
  'ai_news_daily_summaries',
  'education_creators',
  'youtube_videos',
  'networking_resources',
  'category_stats',
  'login_streaks',
  'points_log'
];

// Mock response generator for different table types
const getMockResponse = (tableName: string) => {
  // Return empty data as default mock response
  return { data: [], error: null };
};

// Create a wrapper around the supabase client to safely query tables
// that may not be included in the generated types
export const safeSupabase = {
  from: (tableName: string) => {
    // Check if this is a table we need to mock
    const shouldMock = MOCK_TABLES.includes(tableName);
    
    if (shouldMock) {
      console.log(`Using mock data for table: ${tableName}`);
      
      // Return a mock query builder with appropriate methods
      return {
        select: () => ({
          eq: () => ({
            single: async () => getMockResponse(tableName),
            maybeSingle: async () => getMockResponse(tableName),
            limit: () => ({
              maybeSingle: async () => getMockResponse(tableName)
            }),
            order: () => ({
              limit: () => ({
                maybeSingle: async () => getMockResponse(tableName)
              })
            })
          }),
          in: () => ({
            single: async () => getMockResponse(tableName),
            maybeSingle: async () => getMockResponse(tableName)
          }),
          order: () => ({
            limit: () => getMockResponse(tableName),
            range: () => getMockResponse(tableName)
          }),
          range: () => getMockResponse(tableName),
          or: () => getMockResponse(tableName),
        }),
        insert: () => ({
          select: () => ({
            single: async () => getMockResponse(tableName)
          })
        }),
        update: () => ({
          eq: () => getMockResponse(tableName)
        }),
        delete: () => ({
          eq: () => getMockResponse(tableName)
        })
      };
    }
    
    // Use type casting to bypass TypeScript's type checking constraints for real tables
    return supabase.from(tableName) as any;
  },
  
  // Add auth object to mock the Supabase auth methods
  auth: {
    getSession: async () => {
      // Use the real Supabase auth when available
      return supabase.auth.getSession();
    },
    getUser: async () => {
      // Use the real Supabase auth when available
      return supabase.auth.getUser();
    }
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
