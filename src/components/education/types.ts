
export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  thumbnail_url: string;
  hd_thumbnail_url?: string;
  created_at?: string;
  educator: {
    name: string;
    avatar_url: string;
    title?: string;
    slug?: string;
    subscriber_count?: number;
    video_count?: number;
    upload_frequency?: string;
  };
  metrics: {
    views: number;
    likes: number;
    comments?: number;
    sentiment_score: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    impact_score: number;
    category?: string;
  };
  topics: string[];
  tags?: string[];
  language?: string;
  has_captions?: boolean;
  category_id?: string;
  full_description?: string;
  ai_analysis: {
    key_takeaways: string[];
    implementation_steps: string[];
  };
}

