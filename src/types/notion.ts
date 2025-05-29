export type BlockType = 
  | 'paragraph'
  | 'heading1'
  | 'heading2' 
  | 'heading3'
  | 'bulleted_list'
  | 'numbered_list'
  | 'toggle'
  | 'quote'
  | 'callout'
  | 'code'
  | 'divider'
  | 'table';

export interface BlockProperties {
  emoji?: string;        // For callouts
  language?: string;     // For code blocks  
  color?: string;        // For styling
  collapsed?: boolean;   // For toggles
  level?: number;        // For nested lists
  checked?: boolean;     // For todo items
}

export interface NotionBlock {
  id: string;
  type: BlockType;
  content: string;
  properties?: BlockProperties;
  children?: NotionBlock[];
  parent_id?: string;
}

export interface NotionDocument {
  id: string;
  title: string;
  blocks: NotionBlock[];
  created_at: string;
  updated_at: string;
}

export interface InlineStyle {
  bold?: boolean;
  italic?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: string;
}

export interface FormattedText {
  content: string;
  styles?: InlineStyle;
}

export interface ParsedContent {
  blocks: NotionBlock[];
  metadata?: {
    title?: string;
    description?: string;
  };
} 