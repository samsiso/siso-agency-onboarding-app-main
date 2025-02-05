export interface Message {
  role: 'user' | 'assistant';
  content: string;
  loading?: boolean;
  steps?: {
    thinking?: string;
    searching?: string;
    processing?: string;
    response?: string;
  };
}