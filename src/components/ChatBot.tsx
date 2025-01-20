import { useState } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    
    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const { data, error } = await supabase.functions.invoke('chat-with-bot', {
        body: { message: userMessage },
      });

      if (error) throw error;

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 animate-glow"
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <div className="w-[350px] h-[500px] bg-siso-bg border border-siso-text/10 rounded-lg shadow-lg flex flex-col">
          <div className="p-4 border-b border-siso-text/10 flex justify-between items-center bg-gradient-to-r from-siso-red/10 to-siso-orange/10">
            <h3 className="font-semibold text-siso-text">SISO Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-siso-text/10"
            >
              <X className="h-4 w-4 text-siso-text" />
            </Button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-siso-orange/20 text-siso-text ml-4'
                      : 'bg-siso-text/10 text-siso-text mr-4'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-siso-text/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-siso-text/5 border border-siso-text/10 rounded-lg px-4 py-2 text-siso-text placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-orange/50"
                disabled={isLoading}
              />
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};