import React from 'react';
import { Bot, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'assistant' | 'user';
  content: string;
  assistantType?: string;
  isLoading?: boolean;
}

export const ChatMessage = ({ role, content, assistantType, isLoading }: ChatMessageProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-4"
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        role === 'assistant' 
          ? 'bg-gradient-to-br from-siso-red to-siso-orange' 
          : 'bg-gradient-to-br from-siso-text/20 to-siso-text/30'
      }`}>
        {role === 'assistant' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-siso-text-bold mb-2">
          {role === 'assistant' ? assistantType : 'You'}
        </p>
        <div className="bg-siso-text/5 rounded-lg p-4 text-siso-text">
          {isLoading ? (
            <div className="flex gap-2">
              <span className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-siso-orange/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          ) : (
            content
          )}
        </div>
      </div>
    </motion.div>
  );
};