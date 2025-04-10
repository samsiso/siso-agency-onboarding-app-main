
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number;
  level: number;
  streak_days: number;
  rank?: number | string;
  siso_tokens?: number;
  updated_at?: string;
  contribution_count?: number;
  referral_count?: number;
  achievements?: Achievement[];
  user?: {
    full_name?: string;
    avatar_url?: string;
  };
  profile?: {
    full_name?: string;
    email?: string;
    bio?: string;
    avatar_url?: string;
    linkedin_url?: string;
    website_url?: string;
    youtube_url?: string;
    instagram_url?: string;
    twitter_url?: string;
    professional_role?: string;
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

export interface TrendStats {
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  points?: number;
  users?: number;
  tokens?: number;
}

export interface Achievement {
  name: string;
  icon: string;
}
