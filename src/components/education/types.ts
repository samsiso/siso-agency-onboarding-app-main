
export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  thumbnail_url: string;
  created_at?: string;
  date?: string; // [Analysis] Added date field from youtube_videos table
  educator: {
    name: string;
    avatar_url: string;
    title?: string;
    slug?: string;
  };
  metrics: {
    views: number;
    likes: number;
    sentiment_score: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    impact_score: number;
    category?: string;
  };
  topics: string[];
  ai_analysis: {
    key_takeaways: string[];
    implementation_steps: string[];
  };
}
