
export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  thumbnail_url: string;
  created_at?: string; // Added this
  educator: {
    name: string;
    avatar_url: string;
    title?: string; // Added this
  };
  metrics: {
    views: number;
    likes: number;
    sentiment_score: number;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    impact_score: number;
    category?: string; // Added this
  };
  topics: string[];
  ai_analysis: {
    key_takeaways: string[];
    implementation_steps: string[];
  };
}
