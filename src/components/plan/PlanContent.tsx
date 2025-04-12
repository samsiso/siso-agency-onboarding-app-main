import { useRef } from 'react';
import { motion } from 'framer-motion';
import { usePlanContext } from '@/contexts/plan/PlanContext';
import { GradientHeading } from '@/components/ui/gradient-heading';
import { WelcomeMessage } from '@/components/plan/WelcomeMessage';
import { AgencyPainPoints } from '@/components/plan/AgencyPainPoints';
import { PlanReviewSummary } from '@/components/plan/PlanReviewSummary';
import { ROICalculator } from '@/components/plan/ROICalculator';
import { FeatureSection } from '@/components/plan/FeatureSection';
import { EnhancedNextSteps } from '@/components/plan/EnhancedNextSteps';
import { caseStudies } from '@/data/plan/featureData';
import { ImplementationPlan } from '@/components/plan/ImplementationPlan';
import { CaseStudy } from '@/components/plan/CaseStudy';
import { InvestmentSection } from '@/components/plan/InvestmentSection';
import { InteractiveCallout } from './InteractiveCallout';
import { Sparkles, Target, BarChart, DollarSign, Users, Clock, CheckCircle } from 'lucide-react';

export const PlanContent = () => {
  const {
    planData,
    showSolutionsSection,
    setShowSolutionsSection,
    showFeatureSelection,
    setShowFeatureSelection,
    selectedFeatures,
    totalTime,
    totalPrice,
    isSubmitting
  } = usePlanContext();
  
  const mainContentRef = useRef<HTMLDivElement>(null);
  
  const handleShowSolutions = () => {
    setShowSolutionsSection(true);
    
    setTimeout(() => {
      if (mainContentRef.current) {
        const solutionsSection = mainContentRef.current.querySelector('#solutions-section');
        if (solutionsSection) {
          solutionsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };
  
  const handleShowFeatures = () => {
    setShowFeatureSelection(true);
    
    setTimeout(() => {
      if (mainContentRef.current) {
        const featuresSection = mainContentRef.current.querySelector('#features-section');
        if (featuresSection) {
          featuresSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }, 100);
  };
  
  if (!planData) return null;
  
  return (
    <div ref={mainContentRef} className="space-y-8">
      <WelcomeMessage 
        agencyName={planData.company_name || 'Your Company'} 
        industryType="OnlyFans"
        scrollToFeatures={handleShowFeatures}
      />
      
      {/* Implementation Plan Section */}
      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GradientHeading 
          className="text-2xl font-bold" 
          variant="primary"
        >
          Your Implementation Plan
        </GradientHeading>
        
        <ImplementationPlan onScrollToFeatures={handleShowFeatures} />
        
        {/* Investment information moved from the bottom section */}
        <InvestmentSection planData={planData} />
      </motion.section>
      
      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GradientHeading 
          className="text-2xl font-bold" 
          variant="primary"
        >
          Understanding Your Agency's Challenges
        </GradientHeading>
        
        <p className="text-siso-text">
          Before we dive into the solution, it's important to understand the challenges 
          that agencies like yours face when scaling beyond $100k/month. Based on our 
          extensive research and surveys, we've identified these key pain points:
        </p>
        
        <AgencyPainPoints onSolutionRequest={handleShowFeatures} />
      </motion.section>
      
      {showSolutionsSection && (
        <motion.section 
          id="solutions-section" 
          className="space-y-4 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GradientHeading 
            className="text-2xl font-bold" 
            variant="primary"
          >
            Our Complete Solution
          </GradientHeading>
          
          <div className="rounded-lg bg-black/20 backdrop-blur-sm border border-siso-text/10 p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-siso-orange/10 p-3">
                <Sparkles className="h-6 w-6 text-siso-orange" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  {planData.app_name || 'OnlyFans Management Suite'}
                </h3>
                <p className="text-siso-text">
                  A comprehensive platform designed specifically for OnlyFans agencies
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <InteractiveCallout 
                title="Industry Focus"
                value="OnlyFans Agency Management"
                type="niche"
                description="Our platform is specifically designed for the unique challenges of managing OnlyFans creator accounts as an agency."
              />
              
              <InteractiveCallout 
                title="Your Company"
                value={planData.company_name || 'Your Agency'}
                type="company"
                description="Customized to match your agency's workflow and branding, ensuring a perfect fit for your team."
              />
              
              <InteractiveCallout 
                title="Product"
                value="All-in-One Management Platform"
                type="product"
                description="Combining content management, analytics, client communication, and business operations in one seamless platform."
              />
              
              <InteractiveCallout 
                title="Release Timeline"
                value={`${planData.estimated_days} Days to Launch`}
                type="niche"
                description={`Your custom platform can be ready for your team in just ${planData.estimated_days} days with our expedited implementation process.`}
              />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-siso-orange" />
                  Core Features
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {planData.features?.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 bg-black/30 rounded-lg p-3 border border-siso-text/10">
                      <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
                      <span className="text-siso-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <BarChart className="h-5 w-5 mr-2 text-siso-orange" />
                  Business Impact
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="bg-black/30 rounded-lg p-3 border border-siso-text/10">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-siso-orange" />
                      <h4 className="text-white font-medium">Revenue Growth</h4>
                    </div>
                    <p className="text-2xl font-bold text-siso-orange mb-1">+35%</p>
                    <p className="text-xs text-siso-text">Average increase in monthly agency revenue</p>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3 border border-siso-text/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-siso-orange" />
                      <h4 className="text-white font-medium">Client Retention</h4>
                    </div>
                    <p className="text-2xl font-bold text-siso-orange mb-1">+60%</p>
                    <p className="text-xs text-siso-text">Improvement in creator retention rate</p>
                  </div>
                  
                  <div className="bg-black/30 rounded-lg p-3 border border-siso-text/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-siso-orange" />
                      <h4 className="text-white font-medium">Time Saved</h4>
                    </div>
                    <p className="text-2xl font-bold text-siso-orange mb-1">15+ hrs</p>
                    <p className="text-xs text-siso-text">Weekly time saved on administrative tasks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      )}
      
      {showFeatureSelection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FeatureSection onFinalizeFeatures={() => {}} />
        </motion.div>
      )}
      
      {selectedFeatures.length > 0 && (
        <motion.section 
          id="review-section" 
          className="space-y-4 pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GradientHeading 
            className="text-2xl font-bold" 
            variant="primary"
          >
            Review Your Plan
          </GradientHeading>
          
          <PlanReviewSummary
            selectedFeatures={selectedFeatures}
            timeline={totalTime}
            totalCost={totalPrice}
            onApprove={() => {}}
            isSubmitting={isSubmitting}
          />
          
          <div className="mt-8">
            <GradientHeading 
              className="text-xl font-bold mb-4" 
              variant="primary"
            >
              Calculate Your Return on Investment
            </GradientHeading>
            
            <ROICalculator
              selectedFeatures={selectedFeatures}
              featuresTimeEstimate={totalTime}
              tier="mvp"
              basePrice={0}
            />
          </div>
        </motion.section>
      )}
      
      <motion.section 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GradientHeading 
          className="text-2xl font-bold" 
          variant="primary"
        >
          Proven Success Stories
        </GradientHeading>
        
        <p className="text-siso-text mb-4">
          See how other OnlyFans agencies have transformed their businesses with our platform:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {caseStudies.map((study, index) => (
            <CaseStudy 
              key={index}
              title={study.title}
              description={study.description}
              imageUrl={study.imageUrl}
              notionUrl={study.notionUrl}
            />
          ))}
        </div>
      </motion.section>
      
      <EnhancedNextSteps 
        showFeatureSelection={showFeatureSelection}
        onShowFeatures={handleShowFeatures}
      />
    </div>
  );
};
