import { motion } from 'framer-motion';
import { ChatMessage } from '../chat/ChatMessage';
import { ChatInput } from '../chat/ChatInput';
import { Message } from './types';

interface ChatStateProps {
  messages: Message[];
  handleSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatState = ({ messages, handleSubmit, isLoading }: ChatStateProps) => {
  return (
    <motion.div
      key="expanded"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-hidden flex flex-col bg-black/20 rounded-lg border border-siso-text/10"
    >
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            assistantType="SISO AI"
            isLoading={message.loading}
            steps={message.steps}
          />
        ))}
      </div>

      <ChatInput 
        onSubmit={handleSubmit}
        isLoading={isLoading}
        placeholder="Type your message here..."
      />
    </motion.div>
  );
};