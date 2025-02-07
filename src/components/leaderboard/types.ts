
export interface Achievement {
  name: string;
  icon: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  points: number | null;
  rank: string | null;
  achievements: Achievement[];
  siso_tokens: number | null;
  updated_at: string;
  contribution_count: number | null;
  referral_count: number | null;
  profile?: {
    full_name: string | null;
    email: string | null;
    bio?: string | null;
    avatar_url?: string | null;
    linkedin_url?: string | null;
    website_url?: string | null;
    youtube_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    professional_role?: string | null;
  };
}
