
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

// [Analysis] Separate feature items for better maintainability
const featureItems = [
  {
    icon: Bot,
    title: "AI-Powered Research",
    description: "Get instant insights and answers powered by advanced AI technology"
  },
  {
    icon: Bot,
    title: "Resource Hub Access",
    description: "Access comprehensive resources and documentation"
  },
  {
    icon: Bot,
    title: "Social Integration",
    description: "Connect and collaborate with the SISO community"
  },
  {
    icon: Bot,
    title: "Automated Tools",
    description: "Streamline your workflow with automated solutions"
  }
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    if (!isExpanded) {
      setIsExpanded(true);
    }

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    
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
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95 overflow-hidden">
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

      <Sidebar />
      <div className="relative z-10 flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            {!isExpanded ? (
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

                {/* Features Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl"
                >
                  {featureItems.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="group relative overflow-hidden rounded-lg bg-black/20 border border-siso-text/10 p-6 hover:bg-black/30 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-siso-red/5 to-siso-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10">
                        <feature.icon className="w-8 h-8 text-siso-orange mb-4" />
                        <h3 className="text-lg font-semibold text-siso-text-bold mb-2">{feature.title}</h3>
                        <p className="text-sm text-siso-text/80">{feature.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            ) : (
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
