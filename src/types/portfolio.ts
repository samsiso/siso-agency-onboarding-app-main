
export interface PortfolioCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category_id?: string;
  client_name?: string;
  client_source?: string;
  development_status?: string;
  project_status?: string;
  invoice_status?: string;
  notion_url?: string;
  technologies: string[];
  live_url?: string;
  github_url?: string;
  highlights: string[];
  completion_date?: string;
  user_id: string;
}
