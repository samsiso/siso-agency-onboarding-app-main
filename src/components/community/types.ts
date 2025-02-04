export interface CommunityMember {
  id: string;
  name: string;
  description?: string;
  member_type?: string;
  youtube_url?: string;
  youtube_videos?: {
    title: string;
    url: string;
  }[];
  website_url?: string;
  specialization?: string[];
  content_themes?: string[];
  profile_image_url?: string;
  member_count?: number;
  join_url?: string;
  platform?: string;
  points?: number;
  rank?: string | null;
  contribution_count?: number;
  referral_count?: number;
  channel_avatar_url?: string;
  number_of_subscribers?: number;
  channel_total_videos?: number;
  channel_location?: string;
  is_featured?: boolean;
  slug: string;
}