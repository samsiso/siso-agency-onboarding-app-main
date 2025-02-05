import { motion, AnimatePresence } from 'framer-motion';
import { Message } from './types';
import { Bot, CheckCircle2, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatStateProps {
  messages: Message[];
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

  const LoadingStep = ({ step, isActive, isCompleted }: { step: string; isActive: boolean; isCompleted: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center space-x-2 text-sm",
        isActive ? "text-siso-text" : "text-siso-text/50",
        isCompleted ? "text-siso-orange" : ""
      )}
    >
      <div className="flex items-center justify-center w-5 h-5">
        {isCompleted ? (
          <CheckCircle2 className="w-4 h-4 text-siso-orange" />
        ) : isActive ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <div className="w-2 h-2 bg-current rounded-full" />
        )}
      </div>
      <span>{step}</span>
    </motion.div>
  );

  const LoadingIndicator = ({ steps }: { steps: Record<string, boolean> }) => (
    <div className="flex flex-col space-y-3">
      {Object.entries(steps).map(([step, completed], index) => (
        <LoadingStep
          key={step}
          step={step}
          isActive={!completed && index === Object.values(steps).filter(Boolean).length}
          isCompleted={completed}
        />
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex flex-col w-full max-w-3xl mx-auto h-full"
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
              <div className="flex-1 space-y-2">
                {message.loading ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <LoadingIndicator
                      steps={{
                        "🤔 Analyzing your question and identifying key topics...": message.steps?.thinking !== undefined,
                        "🔍 Searching through SISO Resource Hub...": message.steps?.searching !== undefined,
                        "⚡ Processing relevant information...": message.steps?.processing !== undefined,
                        "💡 Generating response...": message.steps?.response !== undefined,
                      }}
                    />
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