
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, Send, Edit2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { supabase } from '@/integrations/supabase/client';
import { ChatMessageList } from '@/components/ui/chat-message-list';
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from '@/components/ui/chat-bubble';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  isEditable?: boolean;
}

interface OnboardingState {
  name: string;
  organization: string;
  appIdea: string;
  step: 'name' | 'organization' | 'appIdea' | 'complete';
}

const OnboardingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { handleSignOut, loading } = useGoogleAuth();
  const navigate = useNavigate();

  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    name: '',
    organization: '',
    appIdea: '',
    step: 'name'
  });

  useEffect(() => {
    // Initialize chat with welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hey there! I'm your SISO assistant, here to help you build your MVP in 48 hours. What's your name?"
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    const userMessageId = Date.now().toString();
    
    // If editing a message
    if (editingMessageId) {
      const updatedMessages = messages.map(msg => 
        msg.id === editingMessageId 
          ? { ...msg, content: input } 
          : msg
      );
      setMessages(updatedMessages);
      setEditingMessageId(null);
      
      // Also update the onboarding state based on which message was edited
      const editedMessage = messages.find(msg => msg.id === editingMessageId);
      if (editedMessage) {
        const userMessageIndex = messages.findIndex(msg => msg.id === editingMessageId);
        if (userMessageIndex > 0) {
          const botPrompt = messages[userMessageIndex - 1].content.toLowerCase();
          
          if (botPrompt.includes("what's your name")) {
            setOnboardingState(prev => ({ ...prev, name: input, step: 'organization' }));
          } else if (botPrompt.includes("organization")) {
            setOnboardingState(prev => ({ ...prev, organization: input, step: 'appIdea' }));
          } else if (botPrompt.includes("mvp")) {
            setOnboardingState(prev => ({ ...prev, appIdea: input, step: 'complete' }));
          }
        }
      }
    } else {
      // Add user message
      const newUserMessage = {
        id: userMessageId,
        role: 'user' as const,
        content: input,
        isEditable: true
      };
      
      setMessages(prev => [...prev, newUserMessage]);
      
      // Update onboarding state based on current step
      if (onboardingState.step === 'name') {
        setOnboardingState(prev => ({ ...prev, name: input, step: 'organization' }));
        
        // Add bot response for organization step after a delay
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: `Nice to meet you, ${input}! I'm excited to work with your team. What's your organization's name?`
            }
          ]);
          setIsSubmitting(false);
        }, 1000);
        
      } else if (onboardingState.step === 'organization') {
        setOnboardingState(prev => ({ ...prev, organization: input, step: 'appIdea' }));
        
        // Add bot response for app idea step after a delay
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: `Thanks! Now let's get to the fun part. What kind of MVP are you looking to build for ${input}?`
            }
          ]);
          setIsSubmitting(false);
        }, 1000);
        
      } else if (onboardingState.step === 'appIdea') {
        setOnboardingState(prev => ({ ...prev, appIdea: input, step: 'complete' }));
        
        // Add bot response for completion step after a delay
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString(),
              role: 'assistant',
              content: `Perfect! We'll help you build a ${input} for ${onboardingState.organization}. Our team will reach out to you shortly to get started on your 48-hour MVP journey.`
            }
          ]);
          
          // Save onboarding data to Supabase
          try {
            await supabase.from('onboarding').insert([
              {
                name: onboardingState.name,
                organization: onboardingState.organization,
                app_idea: input
              }
            ]);
          } catch (error) {
            console.error('Error saving onboarding data:', error);
          }
          
          setIsSubmitting(false);
          
          // Redirect to thank you page after a delay
          setTimeout(() => {
            navigate('/thankyou');
          }, 5000);
        }, 1000);
      }
    }
    
    // Clear input after sending message
    setInput('');
  };
  
  const handleEditMessage = (message: Message) => {
    setInput(message.content);
    setEditingMessageId(message.id);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black">
      {/* Header */}
      <div className="p-4 flex items-center">
        <SignOutButton 
          onClick={handleSignOut} 
          disabled={loading}
        />
        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-white">SISO Onboarding</h1>
        </div>
        <div className="w-[72px]"></div> {/* Empty div for balance */}
      </div>
      
      {/* Chat area */}
      <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-6 mx-auto w-full max-w-3xl">
        <ChatMessageList>
          {messages.map((message, index) => (
            <ChatBubble 
              key={message.id} 
              variant={message.role === 'assistant' ? 'received' : 'sent'}
            >
              {message.role === 'assistant' ? (
                <ChatBubbleAvatar 
                  fallback="S" 
                  className="bg-gradient-to-r from-siso-red to-siso-orange"
                />
              ) : (
                <ChatBubbleAvatar 
                  fallback={onboardingState.name.charAt(0).toUpperCase() || 'U'} 
                  className="bg-siso-text/30"
                />
              )}
              
              <div className="flex flex-col">
                <ChatBubbleMessage variant={message.role === 'assistant' ? 'received' : 'sent'}>
                  {message.content}
                </ChatBubbleMessage>
                
                {message.isEditable && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="self-end mt-1"
                  >
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 text-siso-text/50 hover:text-siso-text"
                      onClick={() => handleEditMessage(message)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                  </motion.div>
                )}
              </div>
            </ChatBubble>
          ))}
        </ChatMessageList>
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-siso-text/10 bg-black/50">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="min-h-[52px] w-full resize-none rounded-lg bg-siso-text/10 border border-siso-text/20 px-4 py-3 text-white placeholder:text-siso-text/50 focus:outline-none focus:ring-2 focus:ring-siso-red/50"
                disabled={isSubmitting}
                rows={1}
              />
            </div>
            <Button 
              onClick={handleSendMessage}
              disabled={isSubmitting || !input.trim()}
              className="bg-gradient-to-r from-siso-red to-siso-orange text-white rounded-full h-[52px] w-[52px] p-0 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="mt-3 text-center text-xs text-siso-text/50">
            Need help? Reach out to{' '}
            <a href="mailto:support@sisoinnovatorshub.io" className="text-siso-orange hover:text-siso-red transition-colors">
              support@sisoinnovatorshub.io
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingChat;
