export interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  categories?: string[];
  url: string;
  image_url?: string;
  thumbnail_url?: string;
  source: string;
  source_icon?: string;
  date?: string;
  published_at?: string;
  author?: string;
  views?: number;
  comments?: number;
  likes?: number;
  saves?: number;
  featured?: boolean;
  sentiment?: 'positive' | 'negative' | 'neutral';
  summary?: string;
  has_summary?: boolean;
  position?: number;
  isDuplicate?: boolean; // Added here
  duplicateOf?: string; // Optional reference to the original article
  similarity?: number; // Optional similarity score
}

export interface Summary {
  id: string;
  article_id: string;
  summary: string;
  created_at: string;
}

export interface Views {
  id: string;
  article_id: string;
  count: number;
  created_at: string;
}
