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
  'ai_news_video_processing',
  'education_creators',
  'youtube_videos',
  'networking_resources',
  'category_stats',
  'login_streaks',
  'points_log',
  'automations',
  'core_tools',
  'performance_metrics',
  'news_sources'
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
        select: (columns?: string) => ({
          eq: (column: string, value: any) => ({
            single: async () => getMockResponse(tableName),
            maybeSingle: async () => getMockResponse(tableName),
            limit: (limit: number) => ({
              maybeSingle: async () => getMockResponse(tableName)
            }),
            order: (column: string, { ascending }: { ascending: boolean }) => ({
              limit: (limit: number) => ({
                maybeSingle: async () => getMockResponse(tableName)
              })
            })
          }),
          in: (column: string, values: any[]) => ({
            single: async () => getMockResponse(tableName),
            maybeSingle: async () => getMockResponse(tableName)
          }),
          order: (column: string, { ascending }: { ascending: boolean }) => ({
            limit: (limit: number) => getMockResponse(tableName),
            range: (from: number, to: number) => getMockResponse(tableName)
          }),
          range: (from: number, to: number) => getMockResponse(tableName),
          or: (filter: string) => getMockResponse(tableName),
          gt: (column: string, value: any) => getMockResponse(tableName),
          lt: (column: string, value: any) => getMockResponse(tableName),
          gte: (column: string, value: any) => getMockResponse(tableName),
          lte: (column: string, value: any) => getMockResponse(tableName),
          not: (column: string, operator: string) => getMockResponse(tableName),
        }),
        insert: (values: any) => ({
          select: (columns?: string) => ({
            single: async () => getMockResponse(tableName)
          })
        }),
        update: (values: any) => ({
          eq: (column: string, value: any) => getMockResponse(tableName),
          match: (criteria: Record<string, any>) => getMockResponse(tableName)
        }),
        delete: () => ({
          eq: (column: string, value: any) => getMockResponse(tableName),
          match: (criteria: Record<string, any>) => getMockResponse(tableName)
        }),
        upsert: (values: any) => getMockResponse(tableName),
        count: (options: any) => getMockResponse(tableName)
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
  },

  // Add functions property to mock Supabase Edge Functions
  functions: {
    invoke: async (functionName: string, options: { body: any }) => {
      console.log(`Mock invoke of Edge Function: ${functionName}`, options);
      return { data: { success: true }, error: null };
    }
  },

  // Mock storage for file uploads
  storage: {
    from: (bucketName: string) => ({
      upload: async (path: string, file: File) => {
        console.log(`Mock upload to ${bucketName}/${path}`);
        return { data: { path }, error: null };
      },
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://mock-storage.example.com/${bucketName}/${path}` }
      })
    })
  },

  // Mock channel for realtime subscriptions with proper interface for unsubscribe
  channel: (channelName: string) => {
    const channelObj = {
      on: (event: string, config: any, callback: (payload: any) => void) => {
        return {
          subscribe: (statusCallback?: (status: string) => void) => {
            console.log(`Mock subscription to ${channelName} for ${event}`);
            if (statusCallback) statusCallback('SUBSCRIBED');
            return channelObj;
          }
        };
      },
      unsubscribe: () => {
        console.log(`Mock unsubscribe from channel: ${channelName}`);
        return Promise.resolve();
      }
    };
    return channelObj;
  },
  
  removeChannel: (channel: any) => {
    if (channel && typeof channel.unsubscribe === 'function') {
      console.log('Removing channel with unsubscribe');
      channel.unsubscribe();
    } else {
      console.log('Mock removal of channel (no unsubscribe method available)');
    }
    return Promise.resolve();
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
