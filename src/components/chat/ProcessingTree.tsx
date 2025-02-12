
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

// [Analysis] Animation variants for staggered children
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

// [Analysis] Particle system for knowledge flow visualization
const KnowledgeStream = () => (
  <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 overflow-hidden">
    {/* Main gradient stream */}
    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-siso-orange/20 via-siso-orange to-siso-red" />
    
    {/* Animated particles */}
    <div className="absolute inset-0">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-siso-orange/50"
          initial={{ y: "100%", x: "50%" }}
          animate={{ 
            y: "-10%",
            x: ["50%", `${45 + Math.random() * 10}%`, "50%"]
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "linear",
            x: {
              duration: 1 + Math.random(),
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
        />
      ))}
    </div>
  </div>
);

export const ProcessingTree = ({ currentStage, agentStatuses }: ProcessingTreeProps) => {
  const stages = ['initial', 'context', 'agents', 'synthesis'];
  const currentIndex = stages.indexOf(currentStage);

  return (
    <div className="relative py-8">
      {/* Knowledge stream visualization */}
      <KnowledgeStream />

      {/* Processing stages */}
      <motion.div 
        className="space-y-12"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Initial understanding */}
        <motion.div variants={itemVariants}>
          <ProcessingNode
            icon={Brain}
            label="Understanding request"
            isActive={currentStage === 'initial'}
            isComplete={currentIndex > 0}
          />
        </motion.div>

        {/* Company context */}
        <motion.div variants={itemVariants}>
          <ProcessingNode
            icon={Building2}
            label="Applying company context"
            isActive={currentStage === 'context'}
            isComplete={currentIndex > 1}
          />
        </motion.div>

        {/* Agent processing */}
        {currentStage === 'agents' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="pl-12 space-y-4"
          >
            {Object.entries(agentStatuses).map(([category, status], index) => {
              const Icon = agentIcons[category as AgentCategory];
              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProcessingNode
                    icon={Icon}
                    label={`${category.charAt(0).toUpperCase() + category.slice(1)} agent`}
                    isActive={status === 'processing'}
                    isComplete={status === 'complete'}
                    size="sm"
                  />
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Synthesis */}
        <motion.div variants={itemVariants}>
          <ProcessingNode
            icon={Sparkles}
            label="Synthesizing information"
            isActive={currentStage === 'synthesis'}
            isComplete={currentIndex > 3}
          />
        </motion.div>
      </motion.div>
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
          "relative flex items-center justify-center rounded-full bg-siso-text/10 z-10 transition-shadow duration-500",
          size === 'sm' ? 'w-8 h-8' : 'w-12 h-12',
          isActive && "shadow-lg shadow-siso-orange/20",
          isComplete && "shadow-md shadow-siso-orange/10"
        )}
      >
        {/* Ripple effect for active nodes */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full bg-siso-red/20"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        <Icon className={cn(
          "text-white relative z-10",
          size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'
        )} />
      </motion.div>
      
      <span className={cn(
        "font-medium relative",
        size === 'sm' ? 'text-sm' : 'text-base',
        isActive ? 'text-white' : 'text-siso-text/70',
        isComplete && 'text-siso-orange'
      )}>
        {label}
        {/* Knowledge absorption effect for active nodes */}
        {isActive && (
          <motion.div
            className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-siso-orange to-siso-red"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </span>

      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -inset-2 bg-siso-text/5 backdrop-blur-sm rounded-lg -z-10"
        />
      )}
    </div>
  );
};
