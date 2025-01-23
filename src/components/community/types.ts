export interface CommunityMember {
  id: string;
  name: string;
  description: string | null;
  member_type: string | null;
  youtube_url: string | null;
  youtube_videos: { title: string; url: string; }[] | null;
  website_url: string | null;
  specialization: string[] | null;
  content_themes: string[] | null;
  profile_image_url: string | null;
  member_count: number | null;
  join_url: string | null;
  platform: string | null;
  points?: number;
  rank?: string | null;
  contribution_count?: number;
  referral_count?: number;
  created_at?: string;
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

export interface Achievement {
  name: string;
  icon: string;
}