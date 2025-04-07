
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageLoading } from '@/components/ui/message-loading';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
}

const OnboardingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize chat with welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Welcome to your app development journey! I'm your SISO assistant, and I'll be guiding you through the onboarding process. Let's get started by collecting some basic information about your app requirements."
      }
    ]);
  }, []);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim() || loading) return;
    
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: "Thank you for sharing that! I've recorded your preferences. We'll now move on to the next steps of your app development journey."
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleContinue = () => {
    navigate('/thankyou');
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-black via-siso-bg to-black">
      {/* Header */}
      <div className="p-4 border-b border-siso-text/10">
        <h1 className="text-xl text-center font-semibold text-white">SISO Onboarding</h1>
      </div>
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`flex items-center justify-center h-8 w-8 rounded-full shrink-0 ${
                message.role === 'assistant' 
                  ? 'bg-gradient-to-r from-siso-red to-siso-orange' 
                  : 'bg-siso-text/30'
              } ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                {message.role === 'assistant' ? <Bot size={16} /> : <User size={16} />}
              </div>
              
              <div className={`rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-black/40 text-white border border-siso-text/10'
                  : 'bg-siso-orange/90 text-black'
              }`}>
                {message.content}
              </div>
            </div>
          </motion.div>
        ))}
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="flex max-w-[80%] flex-row">
              <div className="flex items-center justify-center h-8 w-8 rounded-full shrink-0 bg-gradient-to-r from-siso-red to-siso-orange mr-2">
                <Bot size={16} />
              </div>
              
              <div className="rounded-lg p-3 bg-black/40 text-white border border-siso-text/10">
                <MessageLoading />
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-siso-text/10">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 bg-black/20 border border-siso-text/20 rounded-lg p-3 text-white placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-orange/50"
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-siso-red to-siso-orange text-white rounded-full h-10 w-10 p-0 flex items-center justify-center"
          >
            <Send size={16} />
          </Button>
        </div>
        
        <div className="mt-4 text-center">
          <Button 
            onClick={handleContinue} 
            variant="outline" 
            className="text-siso-text border-siso-text/30 hover:bg-siso-text/10"
          >
            Skip Onboarding
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingChat;
