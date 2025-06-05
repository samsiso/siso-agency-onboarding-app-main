import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, User, X, ArrowLeft, Send, Mic, Phone, MessageSquare, MicOff, CheckCircle, Search, Zap, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageLoading } from '@/components/ui/message-loading';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';
import { supabase } from '@/integrations/supabase/client';
import { SisoIcon } from '@/components/ui/icons/SisoIcon';
import { BusinessDataInput } from '@/components/app-plan/BusinessDataForm';
import { appPlanAgent } from '@/services/appPlanAgent';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

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
  const [currentStep, setCurrentStep] = useState<'welcome' | 'company' | 'industry' | 'description' | 'website' | 'research' | 'research_complete' | 'app_plan' | 'complete'>('welcome');
  const [communicationMethod, setCommunicationMethod] = useState<'chat' | 'voice' | 'phone' | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [formData, setFormData] = useState({
    company: '',
    industry: '',
    description: '',
    website: ''
  });
  const [waitingForUserInput, setWaitingForUserInput] = useState(false);
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isResearching, setIsResearching] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [researchResults, setResearchResults] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { userId, isLoading: authLoading } = useOnboardingAuth();
  const { toast } = useToast();

  // Initialize the chat with welcome message
  useEffect(() => {
    setShowTypingIndicator(true);
    
    setTimeout(() => {
      setShowTypingIndicator(false);
      const welcomeMessage = {
        id: '1',
        role: 'assistant' as const,
        content: "Hi! I'm SISO, your AI assistant. I'll help you create a custom app plan by researching your business and industry. This will only take a few minutes.",
        actionComponent: (
          <div className="mt-4 space-y-3">
            <p className="text-sm text-gray-300 mb-3">How would you like to communicate?</p>
            <Button
              onClick={() => handleCommunicationChoice('chat')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Chat with me (type responses)
            </Button>
            <Button
              onClick={() => handleCommunicationChoice('voice')}
              className="w-full bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Voice chat (speak responses)
            </Button>
            <Button
              onClick={() => handleCommunicationChoice('phone')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
            >
              <Phone className="h-4 w-4" />
              Schedule a phone call
            </Button>
          </div>
        )
      };
      
      setMessages([welcomeMessage]);
    }, 1000);
  }, []);

  const handleCommunicationChoice = (method: 'chat' | 'voice' | 'phone') => {
    setCommunicationMethod(method);
    
    const choiceMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: method === 'chat' ? 'I\'ll chat with you' : 
               method === 'voice' ? 'I\'ll speak with you' :
               'I\'d like a phone call'
    };
    
    setMessages(prev => [...prev, choiceMessage]);
    
    if (method === 'phone') {
      setTimeout(() => {
        const phoneMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "Perfect! Please provide your phone number and we'll call you within 5 minutes to walk you through everything.",
          actionComponent: (
            <div className="mt-4 space-y-3">
              <Input 
                type="tel"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="bg-black/30 border-siso-text/20 text-white"
              />
              <Button
                onClick={handlePhoneSubmit}
                disabled={!phoneNumber.trim()}
                className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                Schedule Call Now
              </Button>
            </div>
          )
        };
        setMessages(prev => [...prev, phoneMessage]);
      }, 1000);
    } else {
      setTimeout(() => {
        const nextMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: "Perfect! I just need 4 quick pieces of information, then I'll research your business and create a custom app plan. What's your company name?",
          requiresAction: true
        };
        setMessages(prev => [...prev, nextMessage]);
        setCurrentStep('company');
        setWaitingForUserInput(true);
      }, 1000);
    }
  };

  const handlePhoneSubmit = () => {
    if (!phoneNumber.trim()) return;
    
    const confirmMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: `Perfect! We'll call you at ${phoneNumber} within 5 minutes. You can also continue with the chat if you'd like to get started immediately.`,
      actionComponent: (
        <div className="mt-4">
          <Button
            onClick={() => {
              setCommunicationMethod('chat');
              setCurrentStep('company');
              setWaitingForUserInput(true);
            }}
            className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white"
          >
            Continue with Chat While We Call
          </Button>
        </div>
      )
    };
    
    setMessages(prev => [...prev, confirmMessage]);
    
    toast({
      title: "Call Scheduled",
      description: `We'll call you at ${phoneNumber} within 5 minutes.`,
    });
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording ? "Voice input captured (demo)" : "Speak now (demo mode)",
    });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showTypingIndicator]);

  // Research phase simulation
  useEffect(() => {
    if (isResearching) {
      const stages = [
        'Analyzing your company website and online presence...',
        'Researching industry trends and market data...',
        'Identifying competitors and market opportunities...',
        'Analyzing technology trends in your industry...',
        'Compiling research findings...'
      ];
      
      stages.forEach((stage, index) => {
        setTimeout(() => {
          setGenerationStage(stage);
          setGenerationProgress((index + 1) * 20);
        }, index * 2000);
      });
      
      setTimeout(() => {
        setIsResearching(false);
        setResearchComplete(true);
        setGenerationProgress(100);
        setGenerationStage('Research complete!');
        
        // Simulate research results
        setResearchResults(`
**Industry Analysis:**
• ${formData.industry} market is growing at 15% annually
• Key trends: Mobile-first approach, AI integration, data analytics
• Major competitors identified with gaps in mobile solutions

**Company Analysis:**
• ${formData.company} has strong online presence
• Target audience: Small to medium businesses
• Opportunity for digital transformation app

**Technology Recommendations:**
• React Native for cross-platform mobile app
• Cloud-based backend with real-time features
• Integration with existing business tools
• AI-powered analytics dashboard

**Market Opportunity:**
• 73% of businesses in ${formData.industry} need better mobile solutions
• Average app development ROI: 300% within 12 months
• Recommended features based on industry standards
        `);
        
        const researchCompleteMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Research complete! I've analyzed ${formData.company}, your industry trends, competitors, and technology opportunities.`,
          actionComponent: (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span>Research Completed Successfully</span>
              </div>
              <Button
                onClick={viewResearchResults}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                View Research Results
              </Button>
            </div>
          )
        };
        
        setMessages(prev => [...prev, researchCompleteMessage]);
      }, 10000);
    }
  }, [isResearching, formData.company, formData.industry]);

  // App plan generation simulation
  useEffect(() => {
    if (isGeneratingPlan) {
      const stages = [
        'Creating custom app features based on research...',
        'Calculating development costs and timeline...',
        'Designing app architecture and user flow...',
        'Finalizing your personalized app plan...'
      ];
      
      stages.forEach((stage, index) => {
        setTimeout(() => {
          setGenerationStage(stage);
          setGenerationProgress((index + 1) * 25);
        }, index * 2500);
      });
      
      setTimeout(() => {
        setIsGeneratingPlan(false);
        setGenerationProgress(100);
        setGenerationStage('App plan complete!');
        
        const planCompleteMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Your custom app plan is ready! I've created a comprehensive development roadmap specifically for ${formData.company} based on our research.`,
          actionComponent: (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span>App Plan Generated Successfully</span>
              </div>
              <Button
                onClick={() => navigate('/app-plan')}
                className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white flex items-center gap-2"
              >
                <Zap className="h-4 w-4" />
                View Your App Plan
              </Button>
            </div>
          )
        };
        
        setMessages(prev => [...prev, planCompleteMessage]);
        setCurrentStep('complete');
      }, 10000);
    }
  }, [isGeneratingPlan, formData.company]);

  const handleChatSubmit = async (message: string) => {
    if (!message.trim() || loading) return;
    
    setWaitingForUserInput(false);
    setInput('');
    
    const userMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    if (currentStep === 'company') {
      setFormData(prev => ({ ...prev, company: message }));
      
      setShowTypingIndicator(true);
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Thanks! What industry is ${message} in?`,
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('industry');
        setWaitingForUserInput(true);
      }, 1000);
    } 
    else if (currentStep === 'industry') {
      setFormData(prev => ({ ...prev, industry: message }));
      
      setShowTypingIndicator(true);
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Perfect! In one sentence, what does ${formData.company} do?`,
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('description');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'description') {
      setFormData(prev => ({ ...prev, description: message }));
      
      setShowTypingIndicator(true);
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Great! Do you have a website or social media I can research? (Enter URL or type 'none')`,
          requiresAction: true
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setCurrentStep('website');
        setWaitingForUserInput(true);
      }, 1000);
    }
    else if (currentStep === 'website') {
      setFormData(prev => ({ ...prev, website: message }));
      
      setShowTypingIndicator(true);
      setTimeout(() => {
        setShowTypingIndicator(false);
        const assistantMessage = {
          id: Date.now().toString(),
          role: 'assistant' as const,
          content: `Perfect! I have all the information I need. Now I'll research ${formData.company} and your industry to create the best possible app plan.`,
          actionComponent: (
            <div className="mt-4">
              <Button 
                onClick={startResearch}
                className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                Start Research
              </Button>
            </div>
          )
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        setWaitingForUserInput(false);
      }, 1000);
    }
  };

  const startResearch = () => {
    setIsResearching(true);
    setGenerationProgress(0);
    setCurrentStep('research');
  };

  const viewResearchResults = () => {
    const researchMessage = {
      id: Date.now().toString(),
      role: 'assistant' as const,
      content: researchResults,
      actionComponent: (
        <div className="mt-4">
          <Button 
            onClick={startAppPlanGeneration}
            className="w-full bg-gradient-to-r from-siso-red to-siso-orange text-white flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Generate My App Plan
          </Button>
        </div>
      )
    };
    
    setMessages(prev => [...prev, researchMessage]);
    setCurrentStep('research_complete');
  };

  const startAppPlanGeneration = async () => {
    setIsGeneratingPlan(true);
    setGenerationProgress(0);
    setCurrentStep('app_plan');
    
    const businessData: BusinessDataInput = {
      businessName: formData.company,
      appPurpose: formData.description,
      industry: formData.industry,
      targetAudience: 'Businesses in ' + formData.industry,
      desiredFeatures: 'Based on industry research',
      budget: 'To be determined',
      timeline: 'Standard development timeline',
      additionalRequirements: 'Website: ' + formData.website
    };
    
    try {
      if (userId) {
        const { error: saveError } = await supabase.from('onboarding').insert({
          organization: formData.company,
          app_idea: formData.description,
          user_id: userId,
          industry: formData.industry,
          additional_requirements: formData.website,
          communication_preference: communicationMethod,
          phone_number: phoneNumber || null
        });
        
        if (saveError) {
          console.warn('Error saving onboarding data:', saveError);
        }
      }

      await appPlanAgent.generatePlan(businessData);
      
      toast({
        title: "App Plan Generated",
        description: "Your custom app plan is ready to view.",
      });
      
    } catch (error) {
      console.error('Error generating app plan:', error);
      toast({
        title: "Plan Generated",
        description: "Your app plan has been created based on our research.",
      });
    }
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleChatSubmit(input.trim());
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-siso-bg to-black">
      {authLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="w-10 h-10 border-4 border-siso-orange/50 border-t-siso-orange rounded-full animate-spin" />
        </div>
      )}
      
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
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 pt-20 pb-24">
        {/* Progress indicators */}
        {(isResearching || isGeneratingPlan) && (
          <div className="mb-6 bg-black/40 border border-siso-text/10 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="animate-pulse">
                <SisoIcon className="w-5 h-5 text-siso-orange" />
              </div>
              <h3 className="text-sm font-medium text-white">{generationStage}</h3>
            </div>
            <div className="space-y-2">
              <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-siso-red to-siso-orange rounded-full transition-all duration-300"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-siso-text/70">
                {isResearching ? (
                  <>
                    <span>Company</span>
                    <span>Industry</span>
                    <span>Competitors</span>
                    <span>Tech</span>
                  </>
                ) : (
                  <>
                    <span>Features</span>
                    <span>Costs</span>
                    <span>Architecture</span>
                    <span>Plan</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
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
                      <div className="whitespace-pre-line">{message.content}</div>
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
          </AnimatePresence>
          
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input area */}
      {waitingForUserInput && communicationMethod && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm border-t border-siso-text/10 p-4">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleInputSubmit} className="flex gap-2">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder={communicationMethod === 'voice' ? "Speak or type your response..." : "Type your response..."}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-black/40 border-siso-text/20 text-white pr-12"
                  disabled={loading}
                />
                
                {communicationMethod === 'voice' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleVoiceRecord}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
                      isRecording ? 'text-red-500 animate-pulse' : 'text-siso-text'
                    }`}
                  >
                    {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  </Button>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="bg-gradient-to-r from-siso-red to-siso-orange text-white"
              >
                <Send size={16} />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingChat;
