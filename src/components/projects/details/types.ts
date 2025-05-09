
export interface ResearchDocument {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  section: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  insights?: string[];
  nextSteps?: string[];
  code_snippet?: string;
  fileUrl?: string;
  project_id?: string;
  isPinned?: boolean;
  order_index?: number;
  related_components?: string[];
}
