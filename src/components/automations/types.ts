export interface Automation {
  id: string;
  name: string;
  description: string | null;
  category: string;
  platform: string | null;
  setup_guide: string | null;
  integration_url: string | null;
  profile_image_url: string | null;
}

export type AutomationCategory = 'all' | 'featured' | 'linkedin' | 'instagram' | 'x' | 'reddit' | 'youtube' | 'tiktok' | 'general';