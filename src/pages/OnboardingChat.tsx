
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, X, ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageLoading } from '@/components/ui/message-loading';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';
import { supabase } from '@/integrations/supabase/client';
import { SisoIcon } from '@/components/ui/icons/SisoIcon';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  requiresAction?: boolean;
  actionComponent?: React.ReactNode;
}

const OnboardingChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'name' | 'company' | 'industry' | 'app_idea' | 'social' | 'complete'>('name');
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    industry: '',
    app_idea: '',
    linkedin: '',
    twitter: '',
    website: ''
  });
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userId, isLoading: authLoading } = useOnboardingAuth();

  // Initialize the chat with welcome message
  useEffect(() => {
    // Show typing indicator first
    setShowTypingIndicator(true);
    
    // Add first message after a short delay
    setTimeout(() => {
      setShowTypingIndicator(false);
      const welcomeMessage = {
        id: '1',
        role: 'assistant' as const,
        content: "👋 Hi there! I'm SISO, your personal assistant. I'll help you get started with our platform by asking a few quick questions."
      };
      
      setMessages([welcomeMessage]);
      
      // Show typing indicator again for second message
      setTimeout(() => {
        setShowTypingIndicator(true);
        
        // Add second message after a short delay
        setTimeout(() => {
          setShowTypingIndicator(false);
          const namePrompt = {
            id: '2',
            role: 'assistant' as const,
            content: "What's your name?",
            requiresAction: true
          };
          
          setMessages(prev => [...prev, namePrompt]);
          setWaitingForUserInput(true);
        }, 1000);
      }, 500);
    }, 1000);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTypingIndicator]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleChatSubmit = async (message: string) => {
    if (!message.trim() || loading) return;
    
    setWaitingForUserInput(false);
    setInput('');
    
    // Add user message to chat
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process the user's message based on current step
    if (currentStep === 'name') {
      // Save the name and move to company step
      setFormData(prev => ({ ...prev, name: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Thanks, ${message}! What company or organization are you with?`,
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('company');
        setWaitingForUserInput(true);
      }, 1000);
    } 
    else if (currentStep === 'company') {
      // Save the company and move to industry step
      setFormData(prev => ({ ...prev, company: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Great! What industry is ${message} in?`,
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('industry');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'industry') {
      // Save the industry and move to app idea step
      setFormData(prev => ({ ...prev, industry: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "Tell me briefly about the app or solution you're looking to build:",
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('app_idea');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'app_idea') {
      // Save the app idea and move to social links step
      setFormData(prev => ({ ...prev, app_idea: message }));
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send next message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "Let's connect! Would you like to share any social or professional links? (Optional - just type 'skip' to continue without adding links)",
          requiresAction: true,
          actionComponent: (
            <div className="mt-3 w-full space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-siso-text w-24">LinkedIn:</span>
                <input 
                  placeholder="Your LinkedIn URL"
                  value={formData.linkedin}
                  onChange={(e) => handleInputChange('linkedin', e.target.value)}
                  className="w-full bg-black/30 border border-siso-text/20 text-white rounded px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-siso-text w-24">Twitter:</span>
                <input 
                  placeholder="Your Twitter URL"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange('twitter', e.target.value)}
                  className="w-full bg-black/30 border border-siso-text/20 text-white rounded px-3 py-2"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-siso-text w-24">Website:</span>
                <input 
                  placeholder="Your Website URL"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  className="w-full bg-black/30 border border-siso-text/20 text-white rounded px-3 py-2"
                />
              </div>
              <div className="mt-2 flex justify-end">
                <Button 
                  onClick={() => handleSocialSubmit()}
                  className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
                >
                  Continue
                </Button>
              </div>
            </div>
          )
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('social');
        
        // Only set waiting for user input if they type "skip" - otherwise they'll use the form
        if (message.toLowerCase() === 'skip') {
          setWaitingForUserInput(true);
        }
      }, 1000);
    }
    else if (currentStep === 'social' && message.toLowerCase() === 'skip') {
      // Handle skip option for social links
      handleFinalSubmit();
    }
  };

  const handleSocialSubmit = async () => {
    // User has filled out the social links form and clicked continue
    setWaitingForUserInput(false);
    
    // Process the social links and complete onboarding
    handleFinalSubmit();
  };

  const handleFinalSubmit = async () => {
    // Save data to Supabase
    setLoading(true);
    
    try {
      const { error } = await supabase.from('onboarding').insert({
        name: formData.name,
        organization: formData.company,
        app_idea: formData.app_idea,
        user_id: userId,
        social_links: {
          linkedin: formData.linkedin,
          twitter: formData.twitter,
          website: formData.website
        }
      });
      
      if (error) throw error;
      
      // Show typing indicator
      setShowTypingIndicator(true);
      
      // Send completion message after delay
      setTimeout(() => {
        setShowTypingIndicator(false);
        
        // Add assistant message to chat
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Thanks for sharing! Based on what you've told me, we can build an MVP for your ${formData.app_idea} at no cost initially. Would you like to proceed?`,
          actionComponent: (
            <div className="mt-4 grid grid-cols-1 gap-4">
              <div className="border rounded-lg p-4 bg-black/20 border-siso-text/10">
                <h3 className="font-semibold text-lg text-siso-text-bold mb-2">Free MVP Plan</h3>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-gradient-to-r from-siso-red to-siso-orange rounded-full mr-2 shrink-0" />
                    <span>Full development of core features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-gradient-to-r from-siso-red to-siso-orange rounded-full mr-2 shrink-0" />
                    <span>Modern, responsive design</span>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-5 h-5 bg-gradient-to-r from-siso-red to-siso-orange rounded-full mr-2 shrink-0" />
                    <span>Build completed in 2-4 weeks</span>
                  </li>
                </ul>
                <Button 
                  onClick={() => navigate('/thankyou-plan')}
                  className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('complete');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      
      // Show error message
      const errorMessage = {
        id: Date.now().toString(),
        role: 'assistant' as const,
        content: "I'm sorry, there was an error saving your information. Please try again."
      };
      
      setMessages(prev => [...prev, errorMessage]);
      
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-black via-siso-bg to-black">
        <div className="w-10 h-10 border-4 border-siso-orange/50 border-t-siso-orange rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-siso-bg to-black">
      {/* Header */}
      <header className="p-4 border-b border-siso-text/10 flex items-center justify-between bg-black/30 backdrop-blur-sm fixed top-0 left-0 right-0 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="text-siso-text hover:text-siso-text-bold hover:bg-black/20"
        >
          <ArrowLeft size={20} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/thankyou')}
          className="text-siso-text hover:text-siso-text-bold hover:bg-black/20"
        >
          <X size={20} />
        </Button>
      </header>
      
      {/* Main chat container */}
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-20 pb-6">
        {/* Chat messages */}
        <div className="flex-1 space-y-4 py-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[90%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full shrink-0 ${
                    message.role === 'assistant' 
                      ? 'bg-gradient-to-r from-siso-red to-siso-orange' 
                      : 'bg-siso-text/30'
                  } ${message.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    {message.role === 'assistant' ? <SisoIcon className="w-6 h-6 text-white" /> : <User size={20} />}
                  </div>
                  
                  <div className="flex flex-col">
                    {message.role === 'assistant' && (
                      <span className="text-xs text-siso-text-muted ml-2 mb-1">SISO</span>
                    )}
                    <div className={`rounded-2xl p-4 ${
                      message.role === 'assistant'
                        ? 'bg-black/40 text-white border border-siso-text/10'
                        : 'bg-siso-orange/90 text-black'
                    }`}>
                      {message.content}
                      {message.actionComponent}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {/* Typing indicator */}
            {showTypingIndicator && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[80%] flex-row">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-siso-red to-siso-orange mr-3">
                    <SisoIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-siso-text-muted ml-2 mb-1">SISO</span>
                    <div className="rounded-2xl p-4 bg-black/40 text-white border border-siso-text/10">
                      <MessageLoading />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex max-w-[80%] flex-row">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-siso-red to-siso-orange mr-3">
                    <SisoIcon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex flex-col">
                    <span className="text-xs text-siso-text-muted ml-2 mb-1">SISO</span>
                    <div className="rounded-2xl p-4 bg-black/40 text-white border border-siso-text/10">
                      <MessageLoading />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Input field */}
            {waitingForUserInput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end mt-4"
              >
                <div className="flex w-full max-w-[90%] flex-row-reverse">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-siso-text/30 ml-3">
                    <User size={20} />
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && input.trim()) {
                          handleChatSubmit(input);
                        }
                      }}
                      placeholder="Type your message..."
                      className="w-full rounded-2xl p-4 pr-12 bg-black/30 border border-siso-text/20 text-white placeholder:text-siso-text/50 focus:outline-none focus:ring-1 focus:ring-siso-red/50"
                      disabled={loading || !waitingForUserInput}
                    />
                    <button
                      onClick={() => handleChatSubmit(input)}
                      disabled={!input.trim() || loading || !waitingForUserInput}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-siso-text disabled:opacity-50 hover:text-siso-orange transition-colors"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {currentStep === 'complete' && (
        <div className="text-center mt-4 pb-6">
          <Button 
            onClick={() => navigate('/thankyou-plan')} 
            variant="outline" 
            className="text-siso-text border-siso-text/30 hover:bg-siso-text/10"
          >
            Continue to Next Step
          </Button>
        </div>
      )}
    </div>
  );
};

export default OnboardingChat;
