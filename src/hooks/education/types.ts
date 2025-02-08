
export interface Educator {
  id: string;
  name: string;
  description: string;
  specialization: string[];
  profile_image_url: string;
  channel_avatar_url: string;
  channel_banner_url: string;
  number_of_subscribers: number;
  channel_total_videos: number;
  channel_location: string;
  slug: string;
  featured_videos: string[];
  is_featured: boolean;
  member_count: number;
}
