
export interface ClientDocument {
  id: string;
  client_id: string;
  title: string;
  content: string;
  document_type: 'app_plan' | 'functionalities' | 'wireframes' | 'inspiration';
  created_at: string;
  updated_at: string;
  created_by?: string;
  last_edited_by?: string;
  is_pinned?: boolean;
  position?: number;
}
