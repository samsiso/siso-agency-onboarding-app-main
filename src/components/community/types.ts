export interface CommunityMember {
  id: string;
  points: number | null;
  rank: string | null;
  contribution_count: number | null;
  referral_count: number | null;
  profile?: {
    full_name: string | null;
    email: string | null;
    bio: string | null;
    avatar_url: string | null;
    linkedin_url: string | null;
    website_url: string | null;
    youtube_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    professional_role: string | null;
  };
}