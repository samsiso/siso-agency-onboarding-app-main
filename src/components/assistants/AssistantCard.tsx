import { Bot, Heart, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

interface Assistant {
  id: string;
  name: string;
  description: string | null;
  category: string;
  assistant_type: string | null;
  prompt_template: string | null;
  use_cases: string[] | null;
  input_variables: string[] | null;
  model_type: string | null;
  response_format: string | null;
  rating: number | null;
  likes_count: number | null;
  downloads_count: number | null;
  gpt_url: string | null;
  gpt_id: string | null;
  profile_image_url: string | null;
  review_average: number | null;
  review_count: number | null;
  num_conversations_str: string | null;
  website_url: string | null;
  created_at: string;
  updated_at: string;
}

interface AssistantCardProps {
  assistant: Assistant;
  onClick: (assistant: Assistant) => void;
}

export function AssistantCard({ assistant, onClick }: AssistantCardProps) {
  return (
    <Card 
      className="group bg-card/50 backdrop-blur border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer"
      onClick={() => onClick(assistant)}
    >
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
            <Bot className="w-4 h-4 text-siso-orange" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-siso-text-bold truncate">{assistant.name}</h3>
            <p className="text-xs text-siso-text/80">{assistant.assistant_type || 'AI Assistant'}</p>
          </div>
        </div>
        {assistant.description && (
          <p className="mt-2 text-xs text-siso-text line-clamp-2">
            {assistant.description}
          </p>
        )}
        <div className="flex gap-2 mt-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-siso-orange" />
            <span className="text-xs text-siso-text">
              {assistant.rating?.toFixed(1) || '-'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-siso-red" />
            <span className="text-xs text-siso-text">{assistant.likes_count || '0'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}