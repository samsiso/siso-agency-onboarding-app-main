
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PainPointsPrompt } from '@/components/plan/PainPointsPrompt';
import { Sparkles, ArrowRight, CheckCircle, DollarSign, Users, BarChart2, TrendingUp, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { WelcomeLoader } from '@/components/plan/WelcomeLoader';
import { PriceSlider } from '@/components/plan/PriceSlider';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useOnboardingAuth } from '@/hooks/useOnboardingAuth';

const DecoraPlan = () => {
  const navigate = useNavigate();
  const { userId } = useOnboardingAuth();
  const [showPrompts, setShowPrompts] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Auto-advance settings - now enabled by default
  const AUTO_ADVANCE = true;
  const AUTO_ADVANCE_DELAY = 4000; // 4 seconds between steps
  
  // ROI Calculator States
  const [showRoiCalculator, setShowRoiCalculator] = useState(false);
  const [creatorCount, setCreatorCount] = useState(10);
  const [avgRevenue, setAvgRevenue] = useState(5000);
  const [growthRate, setGrowthRate] = useState(10);
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [timeFrameMonths, setTimeFrameMonths] = useState(12);
  
  // Calculated ROI values
  const [monthlySavings, setMonthlySavings] = useState(0);
  const [projectedIncrease, setProjectedIncrease] = useState(0);
  const [totalROI, setTotalROI] = useState(0);
  
  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Simulating loading progress with more natural, non-linear progression
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Make progress slower at the beginning and end
        if (prev >= 100) {
          clearInterval(progressInterval);
          setLoadingComplete(true);
          return 100;
        }
        
        // Slower progress between 70-95% to make it feel more realistic
        if (prev > 70 && prev < 95) {
          return prev + 1;
        }
        
        return prev + (prev < 30 ? 4 : 3);
      });
    }, 150);
    
    return () => clearInterval(progressInterval);
  }, []);
  
  // Calculate ROI based on inputs
  useEffect(() => {
    // Calculate time savings
    const hourlyRate = 30; // Assumed hourly rate for staff
    const timeSavingsPerWeek = hoursPerWeek * 0.4; // Assume 40% time savings
    const monthlySavings = timeSavingsPerWeek * 4 * hourlyRate;
    setMonthlySavings(monthlySavings);
    
    // Calculate projected revenue increase
    const monthlyRevenue = avgRevenue * creatorCount;
    const revenueFactor = 0.25; // Assume 25% growth efficiency
    const monthlyIncrease = monthlyRevenue * (growthRate / 100) * revenueFactor;
    setProjectedIncrease(monthlyIncrease);
    
    // Calculate total ROI
    const totalCost = 4997; // Example base price
    const totalBenefit = (monthlySavings + monthlyIncrease) * timeFrameMonths;
    const roi = ((totalBenefit - totalCost) / totalCost) * 100;
    setTotalROI(Math.max(0, roi));
  }, [creatorCount, avgRevenue, growthRate, hoursPerWeek, timeFrameMonths]);
  
  const handlePromptsComplete = () => {
    setShowPrompts(false);
    
    // After small delay for animation, navigate to the plan
    setTimeout(() => {
      navigate('/plan/decora', { replace: true });
    }, 800);
  };
  
  const handleSkipToFullPlan = () => {
    navigate('/plan/decora', { replace: true });
  };
  
  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
    } else {
      handlePromptsComplete();
    }
  };
  
  const toggleRoiCalculator = () => {
    setShowRoiCalculator(!showRoiCalculator);
  };
  
  // Helper function to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(value);
  };
  
  // Get ROI color based on value
  const getRoiColor = (roi: number) => {
    if (roi >= 200) return "text-green-500";
    if (roi >= 100) return "text-siso-orange";
    return "text-siso-red";
  };
  
  const steps = [
    "Personalizing your experience...",
    "Mapping solutions to your agency needs...",
    "Finalizing your custom OnlyFans Management Suite..."
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-siso-bg to-black flex flex-col items-center p-4">
      {/* Progress bar that shows how far down the page you've scrolled */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-black/30">
        <div 
          className="h-full bg-gradient-to-r from-siso-red to-siso-orange transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      
      {showPrompts ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full max-w-4xl"
        >
          <PainPointsPrompt 
            onComplete={handlePromptsComplete} 
            currentStep={currentStep}
            onNextStep={handleNextStep}
            autoAdvance={AUTO_ADVANCE}
            autoAdvanceDelay={AUTO_ADVANCE_DELAY}
          />
          
          <div className="mt-6 text-center">
            <Button 
              variant="link" 
              className="text-siso-text hover:text-white"
              onClick={handleSkipToFullPlan}
            >
              Skip to full plan
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full"
        >
          <WelcomeLoader
            progress={loadingProgress}
            complete={loadingComplete}
            steps={steps}
            onContinue={handleSkipToFullPlan}
          />
          
          {loadingComplete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 max-w-md mx-auto"
            >
              <Button
                onClick={toggleRoiCalculator}
                className="w-full bg-black/30 border border-siso-orange/30 text-siso-orange hover:bg-siso-orange/10"
              >
                {showRoiCalculator ? "Hide ROI Calculator" : "Calculate Your ROI"}
                <Calculator className="ml-2 h-4 w-4" />
              </Button>
              
              {showRoiCalculator && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6 bg-black/20 border border-siso-text/10 rounded-lg p-4"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-siso-orange/10 p-2">
                      <Calculator className="h-4 w-4 text-siso-orange" />
                    </div>
                    <GradientHeading className="text-lg font-semibold" variant="primary">
                      ROI Calculator
                    </GradientHeading>
                  </div>
                  
                  <div className="space-y-6 mb-6">
                    <PriceSlider
                      label="Number of Creators"
                      value={creatorCount}
                      onChange={setCreatorCount}
                      min={1}
                      max={50}
                      description="How many OnlyFans creators you manage"
                    />
                    
                    <PriceSlider
                      label="Average Monthly Revenue per Creator"
                      value={avgRevenue}
                      onChange={setAvgRevenue}
                      min={1000}
                      max={20000}
                      step={500}
                      unit="£"
                      description="Average monthly earnings per creator"
                    />
                    
                    <PriceSlider
                      label="Target Growth Rate"
                      value={growthRate}
                      onChange={setGrowthRate}
                      min={5}
                      max={50}
                      unit="%"
                      description="Your target growth percentage in the next year"
                    />
                    
                    <PriceSlider
                      label="Current Admin Hours Per Week"
                      value={hoursPerWeek}
                      onChange={setHoursPerWeek}
                      min={5}
                      max={80}
                      unit=" hrs"
                      description="Hours spent on administrative tasks weekly"
                    />
                  </div>
                  
                  <Tabs defaultValue="monthly" className="mb-4">
                    <TabsList className="grid grid-cols-2 bg-black/30 mb-4">
                      <TabsTrigger value="monthly">Monthly Benefits</TabsTrigger>
                      <TabsTrigger value="total">Total ROI</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="monthly" className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-black/30 rounded-lg p-4 border border-siso-text/10">
                          <div className="flex items-center mb-2">
                            <DollarSign className="h-4 w-4 text-siso-orange mr-2" />
                            <h4 className="text-white font-medium">Monthly Time Savings</h4>
                          </div>
                          <p className="text-xl font-bold text-siso-orange">
                            {formatCurrency(monthlySavings)}
                          </p>
                        </div>
                        
                        <div className="bg-black/30 rounded-lg p-4 border border-siso-text/10">
                          <div className="flex items-center mb-2">
                            <TrendingUp className="h-4 w-4 text-siso-orange mr-2" />
                            <h4 className="text-white font-medium">Revenue Increase</h4>
                          </div>
                          <p className="text-xl font-bold text-siso-orange">
                            {formatCurrency(projectedIncrease)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="bg-black/30 rounded-lg p-4 border border-siso-text/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <BarChart2 className="h-4 w-4 text-siso-orange mr-2" />
                            <h4 className="text-white font-medium">Total Monthly Benefit</h4>
                          </div>
                        </div>
                        <p className="text-2xl font-bold text-siso-orange">
                          {formatCurrency(monthlySavings + projectedIncrease)}
                        </p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="total" className="space-y-4">
                      <div className="bg-black/30 rounded-lg p-4 border border-siso-text/10">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <BarChart2 className="h-4 w-4 text-siso-orange mr-2" />
                            <h4 className="text-white font-medium">Return on Investment</h4>
                          </div>
                        </div>
                        <p className={`text-2xl font-bold ${getRoiColor(totalROI)}`}>
                          {totalROI.toFixed(0)}%
                        </p>
                        <p className="text-xs text-siso-text mt-1">
                          Over 12 months
                        </p>
                      </div>
                      
                      <div className="bg-siso-orange/10 rounded-lg p-4 border border-siso-orange/30">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-white font-semibold mb-1">Your Business Impact</h4>
                            <p className="text-sm text-siso-text">
                              Based on your inputs, our platform could generate up to {formatCurrency((monthlySavings + projectedIncrease) * 12)} in combined savings and revenue over 12 months.
                            </p>
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DecoraPlan;
