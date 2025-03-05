import { NewsItem } from './blog';
import { ContentCategory, TechnicalComplexity, ArticleImpact } from './blog';

export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  category: ContentCategory;
  tags: string[];
  complexity: TechnicalComplexity;
  estimated_reading_time: number;
  impact: ArticleImpact;
  sections: SectionTemplate[];
  is_draft: boolean;
  created_at: string;
  updated_at: string;
}

export interface SectionTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  order: number;
  template_id: string;
  created_at: string;
  updated_at: string;
}
