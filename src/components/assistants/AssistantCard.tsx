import { Bot, Heart, Star } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

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
  website_url: string | null;
  gpt_url: string | null;
  review_average: number | null;
  review_count: number | null;
  num_conversations_str: string | null;
}

interface AssistantCardProps {
  assistant: Assistant;
  onClick: (assistant: Assistant) => void;
  index: number;
}

export function AssistantCard({ assistant, onClick, index }: AssistantCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card 
        className="group relative bg-gradient-to-br from-siso-bg-alt to-siso-bg border-siso-text/10 hover:border-siso-orange/50 transition-all duration-300 cursor-pointer overflow-hidden h-full"
        onClick={() => onClick(assistant)}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-siso-red/5 to-siso-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-4 relative z-10">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center ring-2 ring-siso-orange/20">
              <Bot className="w-5 h-5 text-siso-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-siso-text-bold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-siso-red group-hover:to-siso-orange transition-all duration-300">
                {assistant.name}
              </h3>
              <p className="text-sm text-siso-text/80">
                {assistant.assistant_type || 'AI Assistant'}
              </p>
            </div>
          </div>

          {assistant.description && (
            <p className="mt-3 text-sm text-siso-text/80 line-clamp-2 group-hover:text-siso-text transition-colors duration-300">
              {assistant.description}
            </p>
          )}

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-siso-text/10">
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-siso-text">
                {assistant.rating?.toFixed(1) || '-'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-siso-red" />
              <span className="text-sm font-medium text-siso-text">
                {assistant.likes_count || '0'}
              </span>
            </div>
            {assistant.num_conversations_str && (
              <div className="ml-auto text-sm text-siso-text/60">
                {assistant.num_conversations_str} conversations
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}