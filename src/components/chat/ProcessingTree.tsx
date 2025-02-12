
import { motion } from 'framer-motion';
import { Bot, Brain, Building2, Network, Newspaper, PlayCircle, Sparkles } from 'lucide-react';
import { AgentCategory, ProcessingStage } from '@/types/chat';
import { cn } from '@/lib/utils';

interface ProcessingTreeProps {
  currentStage: ProcessingStage;
  agentStatuses: Record<AgentCategory, 'pending' | 'processing' | 'complete'>;
}

const agentIcons: Record<AgentCategory, typeof Bot> = {
  'ai-tools': Sparkles,
  'videos': PlayCircle,
  'networking': Network,
  'assistants': Bot,
  'educators': Brain,
  'news': Newspaper,
};

export const ProcessingTree = ({ currentStage, agentStatuses }: ProcessingTreeProps) => {
  const stages = ['initial', 'context', 'agents', 'synthesis'];
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="relative py-8">
      {/* Main vertical line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-siso-orange/20 via-siso-orange to-siso-red" />

      {/* Processing stages */}
      <div className="space-y-12">
        {/* Initial understanding */}
        <ProcessingNode
          icon={Brain}
          label="Understanding request"
          isActive={currentStage === 'initial'}
          isComplete={currentIndex > 0}
        />

        {/* Company context */}
        <ProcessingNode
          icon={Building2}
          label="Applying company context"
          isActive={currentStage === 'context'}
          isComplete={currentIndex > 1}
        />

        {/* Agent processing */}
        {currentStage === 'agents' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-12 space-y-4"
          >
            {Object.entries(agentStatuses).map(([category, status]) => {
              const Icon = agentIcons[category as AgentCategory];
              return (
                <ProcessingNode
                  key={category}
                  icon={Icon}
                  label={`${category.charAt(0).toUpperCase() + category.slice(1)} agent`}
                  isActive={status === 'processing'}
                  isComplete={status === 'complete'}
                  size="sm"
                />
              );
            })}
          </motion.div>
        )}

        {/* Synthesis */}
        <ProcessingNode
          icon={Sparkles}
          label="Synthesizing information"
          isActive={currentStage === 'synthesis'}
          isComplete={currentIndex > 3}
        />
      </div>
    </div>
  );
};

interface ProcessingNodeProps {
  icon: typeof Bot;
  label: string;
  isActive: boolean;
  isComplete: boolean;
  size?: 'sm' | 'default';
}

const ProcessingNode = ({ icon: Icon, label, isActive, isComplete, size = 'default' }: ProcessingNodeProps) => {
  return (
    <div className={cn(
      "relative flex items-center",
      size === 'sm' ? 'gap-3' : 'gap-4'
    )}>
      <motion.div
        initial={false}
        animate={{
          scale: isActive ? 1.1 : 1,
          backgroundColor: isComplete ? 'rgb(var(--siso-orange))' : isActive ? 'rgb(var(--siso-red))' : 'rgb(var(--siso-text) / 0.1)',
        }}
        className={cn(
          "flex items-center justify-center rounded-full bg-siso-text/10 z-10",
          size === 'sm' ? 'w-8 h-8' : 'w-12 h-12'
        )}
      >
        <Icon className={cn(
          "text-white",
          size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
        )} />
      </motion.div>
      
      <span className={cn(
        "font-medium",
        size === 'sm' ? 'text-sm' : 'text-base',
        isActive ? 'text-white' : 'text-siso-text/70',
        isComplete && 'text-siso-orange'
      )}>
        {label}
      </span>

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-2 bg-siso-text/5 rounded-lg -z-10"
        />
      )}
    </div>
  );
};
