
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  BarChart, 
  CheckCircle, 
  Loader2, 
  Sparkles, 
  Heart, 
  DollarSign, 
  Calendar, 
  Clock, 
  ArrowRight,
  FastForward,
  Trophy,
  TrendingUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import '../components/ai-news/animations.css';
import { WelcomeBackground } from '@/components/plan/BackgroundElements';
import { ClickThroughPrompt } from '@/components/plan/ClickThroughPrompt';
import { InteractiveCallout } from '@/components/plan/InteractiveCallout';

const ParticleBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 md:h-2 md:w-2 rounded-full bg-siso-orange/20"
          initial={{ 
            x: Math.random() * 100 + "%", 
            y: Math.random() * 100 + "%", 
            opacity: 0.1 + Math.random() * 0.3 
          }}
          animate={{ 
            x: `${Math.random() * 100}%`, 
            y: `${Math.random() * 100}%`,
            opacity: [0.1 + Math.random() * 0.3, 0.2 + Math.random() * 0.4, 0.1 + Math.random() * 0.3]
          }}
          transition={{ 
            duration: 10 + Math.random() * 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

const ProblemSolutionCard = ({ problem, solution, icon, active, delay }) => {
  const Icon = icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ 
        opacity: active ? 1 : 0.4, 
        x: 0,
        transition: { delay: delay * 0.15 }
      }}
      className={`flex items-start gap-3 bg-black/20 rounded-lg p-3 border ${active ? 'border-siso-orange/30' : 'border-siso-text/10'}`}
    >
      <div className={`flex items-center justify-center w-10 h-10 rounded-full ${active ? 'bg-siso-orange/20' : 'bg-siso-text/5'}`}>
        {active ? (
          <Icon className="h-5 w-5 text-siso-orange" />
        ) : (
          <div className="h-5 w-5 rounded-full bg-siso-text/20" />
        )}
      </div>
      <div>
        <h3 className={`font-medium ${active ? 'text-white' : 'text-siso-text/50'}`}>{problem}</h3>
        <p className={`text-sm mt-1 ${active ? 'text-siso-text' : 'text-siso-text/30'}`}>{solution}</p>
      </div>
    </motion.div>
  );
};

interface AnalysisStepProps {
  step: {
    icon: React.ReactNode;
    text: string;
    tooltip: string;
  };
  isActive: boolean;
  isCompleted: boolean;
  index: number;
}

const AnalysisStep = ({ step, isActive, isCompleted, index }: AnalysisStepProps) => {
  const steps = [
    { icon: <Users className="h-5 w-5 text-siso-orange" />, text: "Analyzing client management needs...", tooltip: "Manage multiple creators efficiently" },
    { icon: <Calendar className="h-5 w-5 text-siso-orange" />, text: "Optimizing content scheduling...", tooltip: "Automate content planning and posting" },
    { icon: <MessageSquare className="h-5 w-5 text-siso-orange" />, text: "Enhancing communication tools...", tooltip: "Streamline creator interactions" },
    { icon: <BarChart className="h-5 w-5 text-siso-orange" />, text: "Finalizing analytics dashboard...", tooltip: "Track performance in real-time" },
    { icon: <DollarSign className="h-5 w-5 text-siso-orange" />, text: "Calculating revenue potential...", tooltip: "Identify new income opportunities" }
  ];
  
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isActive ? 1 : isCompleted ? 0.8 : 0.3,
              y: 0 
            }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
            className="flex items-center gap-3 cursor-help"
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              isCompleted ? 'bg-siso-orange/20' : isActive ? 'bg-siso-orange/10' : 'bg-siso-text/5'
            }`}>
              {isCompleted ? (
                <CheckCircle className="h-4 w-4 text-siso-orange" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 text-siso-orange animate-spin" />
              ) : (
                step.icon
              )}
            </div>
            <p className={`text-sm ${
              isActive || isCompleted ? 'text-siso-text' : 'text-siso-text/50'
            }`}>
              {step.text}
            </p>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-black/90 border-siso-orange/20 text-white">
          {step.tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [loadingStep, setLoadingStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showClickThroughPrompt, setShowClickThroughPrompt] = useState(true);
  const [showProblemSolution, setShowProblemSolution] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [agencyName] = useState("Decora");
  const [skipAnimation, setSkipAnimation] = useState(false);
  
  const [activeSolutions, setActiveSolutions] = useState([true, true, true, true]);
  
  const analysisSteps = [
    { icon: <Users className="h-5 w-5 text-siso-orange" />, text: "Analyzing client management needs...", tooltip: "Manage multiple creators efficiently" },
    { icon: <Calendar className="h-5 w-5 text-siso-orange" />, text: "Optimizing content scheduling...", tooltip: "Automate content planning and posting" },
    { icon: <MessageSquare className="h-5 w-5 text-siso-orange" />, text: "Enhancing communication tools...", tooltip: "Streamline creator interactions" },
    { icon: <BarChart className="h-5 w-5 text-siso-orange" />, text: "Finalizing analytics dashboard...", tooltip: "Track performance in real-time" },
    { icon: <DollarSign className="h-5 w-5 text-siso-orange" />, text: "Calculating revenue potential...", tooltip: "Identify new income opportunities" }
  ];
  
  const handleGetStarted = () => {
    setShowClickThroughPrompt(false);
    startOnboardingSequence();
  };
  
  const startOnboardingSequence = () => {
    if (skipAnimation) {
      navigate('/plan/decora');
      return;
    }
    
    setShowProblemSolution(true);
    
    setLoadingStep(2);
    
    const stepTimer = setTimeout(() => {
      setLoadingStep(5);
      
      setTimeout(() => {
        navigate('/plan/decora');
      }, 2000);
    }, 1500);
    
    return () => {
      clearTimeout(stepTimer);
    };
  };
  
  const handleSkip = () => {
    setSkipAnimation(true);
    navigate('/plan/decora');
  };
  
  const problemSolutions = [
    { 
      problem: "Client Retention Issues", 
      solution: "40% improved client retention with transparent reporting",
      icon: Users
    },
    { 
      problem: "Content Disorganization", 
      solution: "Save 15+ hours weekly with centralized management",
      icon: Calendar
    },
    { 
      problem: "Inefficient Onboarding", 
      solution: "Cut onboarding time by 60% with automated flows",
      icon: Clock
    },
    { 
      problem: "Communication Breakdowns", 
      solution: "Never miss important messages with unified inbox",
      icon: MessageSquare
    }
  ];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4 relative overflow-hidden">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={handleSkip} 
        className="absolute top-4 right-4 text-siso-text hover:text-white hover:bg-black/20 z-10"
      >
        <FastForward className="w-4 h-4 mr-1" />
        Skip
      </Button>
      
      <WelcomeBackground />
      {!showWelcome && !showClickThroughPrompt && <ParticleBackground />}
      
      <AnimatePresence>
        {showWelcome && showClickThroughPrompt && (
          <ClickThroughPrompt 
            agencyName={agencyName} 
            onContinue={handleGetStarted} 
          />
        )}
        
        {showProblemSolution && (
          <motion.div 
            key="problem-solution"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-xl w-full"
          >
            <div className="bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
              <div className="mb-4 flex justify-between items-center">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 mb-2"
                >
                  <Heart className="h-5 w-5 text-siso-orange" />
                  <h2 className="text-white text-lg font-semibold">Tailored for OnlyFans Agencies</h2>
                </motion.div>
                
                <motion.div className="flex items-center gap-1 text-sm text-siso-orange" initial={{opacity: 0}} animate={{opacity: 1}}>
                  <Trophy className="h-4 w-4" />
                  <span>500+ Agencies</span>
                </motion.div>
              </div>
              
              {/* Interactive Callout Boxes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                <InteractiveCallout 
                  title="Agency Niche" 
                  value="OnlyFans Management" 
                  type="niche"
                  description="Our platform is specifically designed for agencies managing OnlyFans creators, with features tailored to the unique needs of content management and creator relationships in this space."
                />
                
                <InteractiveCallout 
                  title="Company Name" 
                  value={agencyName} 
                  type="company"
                  description="Your agency dashboard will be fully customized with your branding, workflows, and specific requirements to ensure it perfectly aligns with how Decora operates."
                />
                
                <InteractiveCallout 
                  title="Product" 
                  value="Agency Dashboard" 
                  type="product"
                  description="A comprehensive dashboard that combines client management, content scheduling, communication tools, and analytics in one seamless platform designed specifically for OnlyFans agency operations."
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {problemSolutions.map((item, index) => (
                  <ProblemSolutionCard 
                    key={index} 
                    problem={item.problem} 
                    solution={item.solution} 
                    icon={item.icon}
                    active={activeSolutions[index]}
                    delay={index}
                  />
                ))}
              </div>
              
              <motion.div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-siso-text">Building your plan</span>
                  <span className="text-sm text-siso-orange">{Math.min(20 * loadingStep, 100)}%</span>
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-siso-red to-siso-orange"
                    initial={{ width: "0%" }}
                    animate={{ width: `${Math.min(20 * loadingStep, 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </motion.div>
              
              <div className="space-y-4">
                {analysisSteps.map((step, index) => (
                  <AnalysisStep
                    key={index}
                    step={step}
                    index={index}
                    isActive={loadingStep === index + 1}
                    isCompleted={loadingStep > index + 1}
                  />
                ))}
              </div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: loadingStep >= 3 ? 1 : 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-6 rounded-lg bg-siso-orange/5 border border-siso-orange/20 p-4 text-sm text-siso-text"
              >
                <p className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-siso-orange shrink-0" />
                  <span>Agencies using our platform see a <span className="font-semibold text-white">40% increase</span> in revenue within 90 days</span>
                </p>
              </motion.div>
              
              <div className="mt-6 flex justify-center">
                <Button 
                  onClick={() => navigate('/plan/decora')}
                  className="bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white px-6 py-2"
                >
                  View Your Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DecoraPlan;
