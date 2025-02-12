
import { motion } from 'framer-motion';
import { Brain, Building2, Sparkles } from 'lucide-react';
import { AgentCategory, ProcessingStage } from '@/types/chat';
import { ProcessingNode } from './processing/ProcessingNode';
import { agentIcons, agentThoughts, containerVariants, itemVariants } from './processing/constants';

interface ProcessingTreeProps {
  currentStage: ProcessingStage;
  agentStatuses: Record<AgentCategory, 'pending' | 'processing' | 'complete'>;
}

export const ProcessingTree = ({ currentStage, agentStatuses }: ProcessingTreeProps) => {
  const stages = ['initial', 'context', 'agents', 'synthesis'];
  const currentIndex = stages.indexOf(currentStage);

  // Split agents into two rows
  const agentEntries = Object.entries(agentStatuses);
  const topRowAgents = agentEntries.slice(0, 3); // First 3 agents
  const bottomRowAgents = agentEntries.slice(3); // Remaining agents

  return (
    <div className="fixed inset-x-0 py-8 px-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          className="relative flex flex-col items-center gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Understanding section */}
          <motion.div variants={itemVariants} className="relative">
            <ProcessingNode
              icon={Brain}
              label="Understanding request"
              isActive={currentStage === 'initial'}
              isComplete={currentIndex > 0}
              thoughts={agentThoughts.initial}
            />
            {/* Connecting line down */}
            {currentIndex > 0 && (
              <motion.div 
                className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-siso-red to-siso-orange"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>

          {/* Context section */}
          <motion.div variants={itemVariants} className="relative">
            <ProcessingNode
              icon={Building2}
              label="Applying company context"
              isActive={currentStage === 'context'}
              isComplete={currentIndex > 1}
              thoughts={agentThoughts.context}
            />
            {/* Connecting lines to agents */}
            {currentIndex > 1 && (
              <motion.div 
                className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-siso-orange to-siso-red"
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </motion.div>

          {/* Agents grid section */}
          {currentStage === 'agents' && (
            <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto">
              {/* Top row agents - appear simultaneously */}
              <motion.div 
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {topRowAgents.map(([category, status]) => {
                  const Icon = agentIcons[category as AgentCategory];
                  return (
                    <motion.div
                      key={category}
                      className="relative"
                    >
                      {/* Vertical connecting line from context */}
                      <motion.div 
                        className="absolute -top-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-siso-orange to-siso-red"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                      
                      <ProcessingNode
                        icon={Icon}
                        label={`${category.charAt(0).toUpperCase() + category.slice(1)} agent`}
                        isActive={status === 'processing'}
                        isComplete={status === 'complete'}
                        size="sm"
                        thoughts={agentThoughts[category as AgentCategory]}
                      />
                      
                      {/* Vertical connecting line to bottom row or synthesis */}
                      {status === 'complete' && (
                        <motion.div 
                          className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-siso-red to-siso-orange"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Bottom row agents - appear with stagger */}
              <motion.div 
                className="grid grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {bottomRowAgents.map(([category, status], index) => {
                  const Icon = agentIcons[category as AgentCategory];
                  return (
                    <motion.div
                      key={category}
                      className="relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    >
                      <ProcessingNode
                        icon={Icon}
                        label={`${category.charAt(0).toUpperCase() + category.slice(1)} agent`}
                        isActive={status === 'processing'}
                        isComplete={status === 'complete'}
                        size="sm"
                        thoughts={agentThoughts[category as AgentCategory]}
                      />
                      
                      {/* Vertical connecting line to synthesis */}
                      {status === 'complete' && (
                        <motion.div 
                          className="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-gradient-to-b from-siso-red to-siso-orange"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* Synthesis section */}
          <motion.div variants={itemVariants}>
            <ProcessingNode
              icon={Sparkles}
              label="Synthesizing information"
              isActive={currentStage === 'synthesis'}
              isComplete={currentIndex > 3}
              thoughts={agentThoughts.synthesis}
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
