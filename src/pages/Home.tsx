
import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { Sidebar } from "@/components/Sidebar";
import { Waves } from '@/components/ui/waves-background';
import { PreChatState } from '@/components/home/PreChatState';
import { ChatState } from '@/components/home/ChatState';

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
              <PreChatState handleSubmit={handleSubmit} isLoading={isLoading} />
            ) : (
              <ChatState 
                messages={messages} 
                handleSubmit={handleSubmit} 
                isLoading={isLoading} 
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
