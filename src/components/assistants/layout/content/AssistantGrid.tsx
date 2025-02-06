
import { Assistant } from '@/components/assistants/types';
import { AssistantCard } from '@/components/assistants/AssistantCard';
import { motion } from 'framer-motion';

interface AssistantGridProps {
  assistants: Assistant[] | undefined;
  onAssistantClick: (assistant: Assistant) => void;
  isLoading: boolean;
}

export function AssistantGrid({ assistants, onAssistantClick, isLoading }: AssistantGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="h-[200px] rounded-lg bg-gradient-to-br from-siso-text/5 to-transparent animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {assistants?.map((assistant, index) => (
        <AssistantCard
          key={assistant.id}
          assistant={assistant}
          onClick={() => onAssistantClick(assistant)}
          index={index}
        />
      ))}
    </div>
  );
}
