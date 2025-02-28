
export type ArticleImpact = 'high' | 'medium' | 'low';

export type TechnicalComplexity = 'basic' | 'intermediate' | 'advanced' | 'mixed';

export type ContentCategory = 
  | 'breakthrough_technologies'
  | 'language_models'
  | 'robotics_automation'
  | 'industry_applications'
  | 'international_developments';

export interface AIAnalysis {
  market_impact: string | null;
  technical_predictions: string[];
  related_technologies: string[];
  business_implications: string | null;
}

export interface DetailedMetadata {
  research_papers: string[];
  industry_reports: string[];
  expert_quotes: string[];
  market_data: string[];
}

export interface ImplementationTimeline {
  short_term: string[];
  medium_term: string[];
  long_term: string[];
}

export interface MarketAnalysis {
  market_size: string | null;
  growth_projections: string | null;
  competitive_landscape: string[];
  investment_metrics: Record<string, any>;
}

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  order_index: number;
  section_order: number;
  technical_complexity: TechnicalComplexity;
  importance_level: string;
  subsection_type: string;
  source_references: Record<string, any>;
  created_at: string;
  updated_at: string;
  last_updated?: string;
  article_id: string;
  overview?: string;
  key_details?: string[];
  bullet_points?: string[];
  implications?: string[];
  related_topics?: string[];
  key_figures?: Record<string, any>;
  reading_time_minutes?: number;
  category?: string;
  is_featured?: boolean;
  metadata?: Record<string, any>;
  // New fields
  ai_analysis?: AIAnalysis;
  detailed_metadata?: DetailedMetadata;
  implementation_timeline?: ImplementationTimeline;
  market_analysis?: MarketAnalysis;
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
  sources: any[];
}

// [Analysis] Added NewsItem type to represent the structure of news items
// from the database which is different from EnhancedNewsItem
export interface NewsItem {
  id: string;
  title: string;
  description: string;
  content: string;
  date: string;
  category: string;
  article_type: string;
  created_at: string;
  author_id: string;
  image_url: string;
  source: string;
  source_credibility: string;
  technical_complexity: string;
  impact: string;
  views: number;
  bookmarks: number;
  reading_time: number;
  featured: boolean;
  profiles?: {
    full_name: string;
    avatar_url: string;
  };
  // [Analysis] Added missing properties causing TypeScript errors
  template_type?: string; // Added to resolve TypeScript error
  status?: string;
  tags?: string[] | ArticleTag[];
  url?: string; // Added for external links support
  content_blocks?: any; // Added for supporting structured content
  cover_image?: string; // Added for article cover images
  banner_template_id?: string; // Added for banner templates
}
