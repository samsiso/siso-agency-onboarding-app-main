import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChatInput } from '@/components/chat/ChatInput';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { supabase } from '@/integrations/supabase/client';

interface VideoChatProps {
  videoId: string;
}

interface Message {
  role: 'assistant' | 'user';
  content: string;
}

export function VideoChat({ videoId }: VideoChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-video', {
        body: { message, videoId },
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-siso-border rounded-lg bg-siso-bg-alt">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <ChatMessage
            key={index}
            role={message.role}
            content={message.content}
            assistantType="Video Assistant"
          />
        ))}
        {isLoading && (
          <ChatMessage
            role="assistant"
            content=""
            assistantType="Video Assistant"
            isLoading={true}
          />
        )}
      </div>
      <ChatInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}