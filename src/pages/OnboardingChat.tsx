
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, Send, ArrowLeft, X, Building, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageLoading } from '@/components/ui/message-loading';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  role: 'assistant' | 'user';
  content: string;
  input?: React.ReactNode;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userId, isLoading: authLoading } = useOnboardingAuth();

  // Initialize the chat with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: '1',
      role: 'assistant' as const,
      content: "👋 Hi there! I'm SISO, your personal assistant. I'll help you get started with our platform by asking a few quick questions. Let's begin with your name."
    };
    
    const nameInputMessage = {
      id: '2',
      role: 'assistant' as const,
      content: "What's your name?",
      input: (
        <div className="mt-3 w-full">
          <Input 
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="bg-black/30 border-siso-text/20 text-white"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && formData.name.trim()) {
                handleContinue();
              }
            }}
          />
          <div className="mt-2 flex justify-end">
            <Button 
              onClick={handleContinue}
              disabled={!formData.name.trim()}
              className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      )
    };
    
    setMessages([welcomeMessage, nameInputMessage]);
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleContinue = async () => {
    // Add user response to chat
    if (currentStep === 'name' && formData.name) {
      addUserResponse(formData.name);
      
      // Move to company step after brief delay
      setTimeout(() => {
        addAssistantMessage(
          "Thanks, " + formData.name + "! What company or organization are you with?",
          <div className="mt-3 w-full">
            <Input 
              placeholder="Enter your company or organization"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="bg-black/30 border-siso-text/20 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && formData.company.trim()) {
                  handleContinue();
                }
              }}
            />
            <div className="mt-2 flex justify-end">
              <Button 
                onClick={handleContinue}
                disabled={!formData.company.trim()}
                className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        );
        setCurrentStep('company');
      }, 500);
    }
    else if (currentStep === 'company' && formData.company) {
      addUserResponse(formData.company);
      
      // Move to industry step after brief delay
      setTimeout(() => {
        addAssistantMessage(
          "Great! What industry is " + formData.company + " in?",
          <div className="mt-3 w-full">
            <Input 
              placeholder="Enter your industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="bg-black/30 border-siso-text/20 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && formData.industry.trim()) {
                  handleContinue();
                }
              }}
            />
            <div className="mt-2 flex justify-end">
              <Button 
                onClick={handleContinue}
                disabled={!formData.industry.trim()}
                className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        );
        setCurrentStep('industry');
      }, 500);
    }
    else if (currentStep === 'industry' && formData.industry) {
      addUserResponse(formData.industry);
      
      // Move to app idea step after brief delay
      setTimeout(() => {
        addAssistantMessage(
          "Tell me briefly about the app or solution you're looking to build:",
          <div className="mt-3 w-full">
            <Input 
              placeholder="Describe your app idea"
              value={formData.app_idea}
              onChange={(e) => handleInputChange('app_idea', e.target.value)}
              className="bg-black/30 border-siso-text/20 text-white"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && formData.app_idea.trim()) {
                  handleContinue();
                }
              }}
            />
            <div className="mt-2 flex justify-end">
              <Button 
                onClick={handleContinue}
                disabled={!formData.app_idea.trim()}
                className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        );
        setCurrentStep('app_idea');
      }, 500);
    }
    else if (currentStep === 'app_idea' && formData.app_idea) {
      addUserResponse(formData.app_idea);
      
      // Move to social links step after brief delay
      setTimeout(() => {
        addAssistantMessage(
          "Let's connect! Would you like to share any social or professional links? (Optional)",
          <div className="mt-3 w-full space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-siso-text w-24">LinkedIn:</span>
              <Input 
                placeholder="Your LinkedIn URL"
                value={formData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="bg-black/30 border-siso-text/20 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-siso-text w-24">Twitter:</span>
              <Input 
                placeholder="Your Twitter URL"
                value={formData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className="bg-black/30 border-siso-text/20 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-siso-text w-24">Website:</span>
              <Input 
                placeholder="Your Website URL"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="bg-black/30 border-siso-text/20 text-white"
              />
            </div>
            <div className="mt-2 flex justify-end">
              <Button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                Continue
              </Button>
            </div>
          </div>
        );
        setCurrentStep('social');
      }, 500);
    }
    else if (currentStep === 'social') {
      // Social links are optional, so we don't check if they're filled
      
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
        
        // Show completion message
        addAssistantMessage(
          "Thanks for sharing! Based on what you've told me, we can build an MVP for your " + 
          formData.app_idea + " at no cost initially. Would you like to proceed?",
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
                onClick={() => {
                  addUserResponse("I'm interested in the Free MVP Plan");
                  setTimeout(() => {
                    addAssistantMessage(
                      "Excellent choice! Let's get started on your project. I'll create an account for you and you'll receive login details shortly.",
                      <div className="mt-4">
                        <Button 
                          onClick={() => navigate('/thankyou')}
                          className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white"
                        >
                          Complete Onboarding
                        </Button>
                      </div>
                    );
                    setCurrentStep('complete');
                  }, 500);
                }}
                className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                Get Started
              </Button>
            </div>
          </div>
        );
        
      } catch (error) {
        console.error('Error saving onboarding data:', error);
        addAssistantMessage("I'm sorry, there was an error saving your information. Please try again.");
      } finally {
        setLoading(false);
        setCurrentStep('complete');
      }
    }
    else if (currentStep === 'complete') {
      navigate('/thankyou');
    }
  };

  const addUserResponse = (content: string) => {
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: content
    };
    
    setMessages(prev => [...prev, userMessage]);
  };

  const addAssistantMessage = (content: string, inputComponent?: React.ReactNode) => {
    const assistantMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: content,
      input: inputComponent
    };
    
    setMessages(prev => [...prev, assistantMessage]);
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
        <h1 className="text-xl font-semibold text-white">Get Started</h1>
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
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-20 pb-24">
        {/* Chat messages */}
        <div className="flex-1 space-y-6 py-4">
          <AnimatePresence>
            {messages.map((message) => (
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
                    {message.role === 'assistant' ? <Bot size={20} /> : <User size={20} />}
                  </div>
                  
                  <div className={`rounded-2xl p-4 ${
                    message.role === 'assistant'
                      ? 'bg-black/40 text-white border border-siso-text/10'
                      : 'bg-siso-orange/90 text-black'
                  }`}>
                    {message.content}
                    {message.input}
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
                  <div className="flex items-center justify-center h-10 w-10 rounded-full shrink-0 bg-gradient-to-r from-siso-red to-siso-orange mr-3">
                    <Bot size={20} />
                  </div>
                  
                  <div className="rounded-2xl p-4 bg-black/40 text-white border border-siso-text/10">
                    <MessageLoading />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </main>
      
      {/* Footer Skip button */}
      <div className="p-4 border-t border-siso-text/10 bg-black/30 backdrop-blur-sm fixed bottom-0 left-0 right-0">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <Button 
              onClick={() => navigate('/thankyou')} 
              variant="outline" 
              className="text-siso-text border-siso-text/30 hover:bg-siso-text/10"
            >
              Skip Onboarding
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingChat;
