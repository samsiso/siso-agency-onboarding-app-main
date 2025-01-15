export interface Tool {
  id: string;
  name: string;
  description: string | null;
  category: string;
  pricing_type: string | null;
  rating: number | null;
  reviews_count: number | null;
  downloads_count: number | null;
  likes_count: number | null;
  member_type: string | null;
  youtube_url: string | null;
  youtube_videos: {
    title: string;
    url: string;
  }[] | null;
  website_url: string | null;
  specialization: string[] | null;
  content_themes: string[] | null;
  profile_image_url: string | null;
  assistant_type: string | null;
  prompt_template: string | null;
  use_cases: string[] | null;
  input_variables: string[] | null;
  model_type: string | null;
  response_format: string | null;
}