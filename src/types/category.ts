
// [Analysis] Basic category types
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
