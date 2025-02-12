
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage } from '@/types/chat';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ProcessingTree } from '@/components/chat/ProcessingTree';

interface ChatStateProps {
  messages: ChatMessage[];
  handleSubmit: (message: string) => Promise<void>;
  isLoading: boolean;
}

export const ChatState = ({ messages, handleSubmit, isLoading }: ChatStateProps) => {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const message = e.currentTarget.querySelector('input')?.value;
    if (message?.trim()) {
      handleSubmit(message.trim());
      e.currentTarget.reset();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col w-full max-w-4xl mx-auto h-full"
    >
      <div className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <AnimatePresence mode="popLayout">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex w-full items-start gap-4 rounded-lg p-4",
                message.role === 'assistant' ? 'bg-black/30' : 'bg-gradient-to-r from-siso-orange/10 to-siso-red/10'
              )}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 rounded-full bg-gradient-to-r from-siso-orange to-siso-red p-2">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div className="flex-1 space-y-4">
                {message.loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-6"
                  >
                    {message.processingStage && message.agentResponses && (
                      <ProcessingTree
                        currentStage={message.processingStage.current}
                        agentStatuses={{
                          'ai-tools': message.agentResponses['ai-tools'].status,
                          'videos': message.agentResponses['videos'].status,
                          'networking': message.agentResponses['networking'].status,
                          'assistants': message.agentResponses['assistants'].status,
                          'educators': message.agentResponses['educators'].status,
                          'news': message.agentResponses['news'].status,
                        }}
                      />
                    )}
                  </motion.div>
                ) : (
                  <div className="text-sm text-gray-200 leading-relaxed">
                    {message.content}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="p-4 border-t border-white/10">
        <form 
          onSubmit={handleFormSubmit}
          className="relative flex items-center"
        >
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full bg-black/30 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-siso-orange/50 border border-white/10"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "absolute right-3 rounded-md px-3 py-1.5 text-sm font-semibold text-white shadow-sm",
              "bg-gradient-to-r from-siso-orange to-siso-red hover:from-siso-orange/90 hover:to-siso-red/90",
              "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-siso-orange",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Send
          </button>
        </form>
      </div>
    </motion.div>
  );
};
