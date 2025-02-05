
import { PlaceholdersAndVanishInputDemo } from "@/components/demo/PlaceholdersAndVanishInputDemo";
import { Sidebar } from "@/components/Sidebar";
import { Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { ChatInput } from '@/components/chat/ChatInput';
import { Waves } from '@/components/ui/waves-background';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  loading?: boolean;
  steps?: {
    thinking?: string;
    searching?: string;
    response?: string;
  };
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Set expanded state if this is the first message
    if (!isExpanded) {
      setIsExpanded(true);
    }

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
    // Add initial AI message with loading state
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      content: '',
      loading: true,
      steps: {
        thinking: '🤔 Analyzing your question and gathering relevant information...',
      }
    }]);
    
    setIsLoading(true);

    try {
      // Update with searching step
      setMessages(prev => {
        const lastMessage = { ...prev[prev.length - 1] };
        lastMessage.steps = {
          ...lastMessage.steps,
          searching: '🔍 Searching through SISO Resource Hub...'
        };
        return [...prev.slice(0, -1), lastMessage];
      });

      const { data, error } = await supabase.functions.invoke('chat-with-assistant', {
        body: { message }
      });

      if (error) throw error;

      // Update with final response
      setMessages(prev => {
        const newMessages = [...prev.slice(0, -1)];
        newMessages.push({ 
          role: 'assistant', 
          content: data.response,
          loading: false,
          steps: {
            thinking: '🤔 I analyzed your question and identified key topics.',
            searching: '🔍 I searched through our resource database.',
            response: '💡 Here\'s what I found:'
          }
        });
        return newMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive"
      });
      // Remove the loading message on error
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95 overflow-hidden">
      {/* Waves Background */}
      <div className="absolute inset-0 z-0">
        <Waves 
          lineColor="rgba(255, 87, 34, 0.2)"
          waveSpeedX={0.02}
          waveSpeedY={0.01}
          waveAmpX={40}
          waveAmpY={20}
          friction={0.9}
          tension={0.01}
          maxCursorMove={120}
          xGap={12}
          yGap={36}
        />
      </div>

      {/* Main Content */}
      <Sidebar />
      <div className="relative z-10 flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
              // Initial State - Logo and Input Only
              <motion.div
                key="initial"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center justify-center h-full"
              >
                {/* Logo Section */}
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

                {/* Title */}
                <motion.h1
                  className="text-2xl md:text-3xl lg:text-4xl font-bold text-siso-text-bold mb-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  How can I assist you today?
                </motion.h1>

                {/* Initial Input */}
                <motion.div
                  className="w-full max-w-2xl"
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
              </motion.div>
            ) : (
              // Expanded Chat Interface
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
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
