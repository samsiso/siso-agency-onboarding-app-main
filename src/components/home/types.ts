export interface Message {
  role: 'assistant' | 'user';
  content: string;
  loading?: boolean;
  steps?: {
    thinking?: string;
    searching?: string;
    response?: string;
  };
}

export interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}