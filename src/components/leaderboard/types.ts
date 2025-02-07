
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
  };
}
