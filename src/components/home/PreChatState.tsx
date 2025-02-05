
import { Bot } from 'lucide-react';
import { motion } from 'framer-motion';
import { ChatInput } from '../chat/ChatInput';
import { FeatureGrid } from './FeatureGrid';

interface PreChatStateProps {
  handleSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const PreChatState = ({ handleSubmit, isLoading }: PreChatStateProps) => {
  return (
    <motion.div
      key="initial"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col items-center justify-center h-full"
    >
      <motion.div
        className="mb-8"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img 
          src="/lovable-uploads/dee36671-c662-422f-a9a0-deb2eeb03973.png" 
          alt="SISO Lion Logo" 
          className="w-24 h-24 object-contain rounded-full"
        />
      </motion.div>

      <motion.h1
        className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text">
          How can I assist you today?
        </span>
      </motion.h1>

      <motion.div
        className="w-full max-w-2xl mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ChatInput 
          onSubmit={handleSubmit}
          isLoading={isLoading}
          placeholder="Type your message here..."
        />
      </motion.div>

      <FeatureGrid />
    </motion.div>
  );
};
