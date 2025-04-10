
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

const DecoraPlan = () => {
  const navigate = useNavigate();
  const [showPrompts, setShowPrompts] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
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
    // Simulating loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setLoadingComplete(true);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
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
        <div className="max-w-md w-full bg-black/40 border border-siso-text/10 rounded-lg p-6 backdrop-blur-sm">
          <div className="text-center mb-6">
            <Sparkles className="h-12 w-12 text-siso-orange mx-auto mb-3" />
            <h2 className="text-2xl font-bold text-white mb-1">
              Preparing Your Custom Plan
            </h2>
            <p className="text-siso-text text-sm">
              We're finalizing your custom OnlyFans Management Suite
            </p>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-siso-text">Loading your custom plan</span>
              <span className="text-sm text-siso-orange">
                {loadingComplete ? 'Ready!' : `${loadingProgress}%`}
              </span>
            </div>
            <Progress 
              value={loadingProgress} 
              className="h-2 bg-black/30" 
              indicatorClassName="bg-gradient-to-r from-siso-red to-siso-orange" 
            />
          </div>
          
          <div className="space-y-3 mb-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  loadingProgress >= (index + 1) * 33 ? 'bg-siso-orange/20' : 'bg-siso-text/5'
                }`}>
                  {loadingProgress >= (index + 1) * 33 ? (
                    <CheckCircle className="h-4 w-4 text-siso-orange" />
                  ) : (
                    <div className="h-4 w-4 rounded-full bg-siso-text/20" />
                  )}
                </div>
                <p className={`text-sm ${
                  loadingProgress >= (index + 1) * 33 ? 'text-siso-text' : 'text-siso-text/50'
                }`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
          
          {loadingComplete && (
            <>
              <Button 
                onClick={handleSkipToFullPlan}
                className="w-full bg-gradient-to-r from-siso-red to-siso-orange hover:opacity-90 text-white mb-4"
              >
                View Your Personalized Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DecoraPlan;
