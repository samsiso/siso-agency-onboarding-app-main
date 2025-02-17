
export interface TextOverlay {
  title: string;
  subtitle: string;
}

export interface TemplateMetadata {
  dateFormat?: string;
  dynamicDate?: boolean;
}

export interface BannerTemplate {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_default: boolean;
  template_type: string;
  text_overlay: TextOverlay;
  metadata?: TemplateMetadata;
  created_at?: string;
  updated_at?: string;
}

export interface BannerTemplateResponse {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  is_default: boolean;
  template_type: string;
  text_overlay: unknown;
  metadata: unknown;
  created_at: string;
  updated_at: string;
}
