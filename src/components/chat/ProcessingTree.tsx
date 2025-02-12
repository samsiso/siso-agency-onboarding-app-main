
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

  return (
    <div className="fixed inset-x-0 py-12 px-4 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
      <div className="max-w-[1400px] mx-auto">
        <motion.div 
          className="relative flex items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* Left section - Understanding */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0"
          >
            <ProcessingNode
              icon={Brain}
              label="Understanding request"
              isActive={currentStage === 'initial'}
              isComplete={currentIndex > 0}
              thoughts={agentThoughts.initial}
            />
          </motion.div>

          {/* Connecting line to Context */}
          <motion.div 
            className="h-0.5 w-24 bg-gradient-to-r from-siso-red to-siso-orange mx-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Center section - Context */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0"
          >
            <ProcessingNode
              icon={Building2}
              label="Applying company context"
              isActive={currentStage === 'context'}
              isComplete={currentIndex > 1}
              thoughts={agentThoughts.context}
            />
          </motion.div>

          {/* Agent section with branching lines */}
          {currentStage === 'agents' && (
            <div className="relative flex-1 mx-8">
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-full h-0.5 bg-gradient-to-r from-siso-orange to-siso-red"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                />
              </div>
              
              <motion.div
                className="relative grid grid-cols-1 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {Object.entries(agentStatuses).map(([category, status], index) => {
                  const Icon = agentIcons[category as AgentCategory];
                  return (
                    <motion.div
                      key={category}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                      className="relative"
                    >
                      {/* Horizontal connecting line */}
                      <div className="absolute top-1/2 -left-4 w-4 h-0.5 bg-gradient-to-r from-siso-orange to-siso-red" />
                      
                      <ProcessingNode
                        icon={Icon}
                        label={`${category.charAt(0).toUpperCase() + category.slice(1)} agent`}
                        isActive={status === 'processing'}
                        isComplete={status === 'complete'}
                        size="sm"
                        thoughts={agentThoughts[category as AgentCategory]}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )}

          {/* Connecting line to Synthesis */}
          <motion.div 
            className="h-0.5 w-24 bg-gradient-to-r from-siso-orange to-siso-red mx-4"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          />

          {/* Right section - Synthesis */}
          <motion.div 
            variants={itemVariants}
            className="flex-shrink-0"
          >
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
