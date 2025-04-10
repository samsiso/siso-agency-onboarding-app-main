
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number;
  level: number;
  streak_days: number;
  rank?: number;
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export interface LeaderboardFilter {
  timeframe: 'all' | 'week' | 'month' | 'day';
  category?: string | null;
}

export interface LeaderboardStats {
  totalParticipants: number;
  avgPoints: number;
  topScore: number;
}

// Add missing TrendStats interface
export interface TrendStats {
  trend: 'up' | 'down' | 'stable';
  percentage: number;
}
