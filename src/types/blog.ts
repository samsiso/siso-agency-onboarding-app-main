
export interface Category {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

export type ContentCategory = 
  | 'ai_research'
  | 'breakthrough_technologies'
  | 'industry_applications'
  | 'policy_ethics'
  | 'products_launches'
  | 'tutorial_guides';

export type TechnicalComplexity = 
  | 'basic'
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'mixed';

export type ArticleImpact = 
  | 'low'
  | 'medium'
  | 'high'
  | 'revolutionary';

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
  isDuplicate?: boolean;
  duplicateOf?: string;
  similarity?: number;
  
  // Add missing properties used in components
  impact?: ArticleImpact;
  bookmarks?: number;
  reading_time?: number;
  estimated_reading_time?: number;
  source_credibility?: string;
  technical_complexity?: TechnicalComplexity;
  article_type?: string;
  category?: string;
  tags?: string[];
  template_type?: string;
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

// Add EnhancedNewsItem interface
export interface EnhancedNewsItem extends NewsItem {
  sections: ArticleSection[];
  key_takeaways?: string[];
  related_articles?: NewsItem[];
}

// Add ArticleSection interface
export interface ArticleSection {
  id: string;
  article_id: string;
  title: string;
  content: string;
  section_order: number;
  order_index?: number;
  importance_level?: 'low' | 'medium' | 'high';
  technical_complexity?: TechnicalComplexity;
  subsection_type?: string;
  category?: string;
  source_references?: Record<string, any>;
  key_details?: string[];
  implications?: string[];
  created_at?: string;
  updated_at?: string;
  last_updated?: string;
  reading_time_minutes?: number;
}
