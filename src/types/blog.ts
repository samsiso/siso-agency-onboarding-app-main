
export type ArticleImpact = 'high' | 'medium' | 'low';

export type TechnicalComplexity = 'basic' | 'intermediate' | 'advanced' | 'mixed';

export type ContentCategory = 
  | 'breakthrough_technologies'
  | 'language_models'
  | 'robotics_automation'
  | 'industry_applications'
  | 'international_developments';

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  order_index: number;
  technical_complexity: TechnicalComplexity;
  created_at: string;
  updated_at: string;
}

export interface ArticleTag {
  id: string;
  tag: string;
  created_at: string;
}

export interface EnhancedNewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: ContentCategory;
  technical_complexity: TechnicalComplexity;
  impact: ArticleImpact;
  estimated_reading_time: number;
  key_takeaways: string[];
  related_articles: Array<{
    id: string;
    title: string;
    description: string;
  }>;
  table_of_contents: Array<{
    id: string;
    title: string;
    level: number;
  }>;
  technical_details: Record<string, any>;
  source_credibility: string;
  tags: ArticleTag[];
  sections: ArticleSection[];
  image_url?: string;
  views: number;
  source: string;
}
