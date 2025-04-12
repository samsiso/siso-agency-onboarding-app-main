
import { useParams } from 'react-router-dom';
import { usePlanData } from '@/hooks/usePlanData';
import { PlanProvider } from '@/contexts/plan/PlanContext';
import { MessageLoading } from '@/components/ui/message-loading';
import { PlanContent } from '@/components/plan/PlanContent';
import { PainPointsModal } from '@/components/plan/PainPointsModal';
import { Button } from '@/components/ui/button';
import { usePlanContext } from '@/contexts/plan/PlanContext';
import { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

// This is a wrapper component that provides the PlanContext
const PlanWithContext = () => {
  const { username } = useParams<{ username: string }>();
  const { loading, planData, error } = usePlanData(username);
  
  // Log debugging information
  useEffect(() => {
    console.log(`Plan page loaded for username: ${username}`);
    console.log(`Loading state: ${loading}`);
    console.log(`Plan data exists: ${Boolean(planData)}`);
    if (planData) {
      console.log(`Company name: ${planData.company_name}`);
      console.log(`Features: ${planData.features?.join(', ')}`);
      console.log(`Status: ${planData.status}`);
    }
    if (error) {
      console.log(`Error loading plan: ${error}`);
    }
  }, [username, loading, planData, error]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
        <div className="text-center space-y-4">
          <MessageLoading className="justify-center mb-4" />
          <h2 className="text-xl font-semibold text-white">Loading your personalized plan...</h2>
          <p className="text-siso-text">We're preparing everything just for you</p>
        </div>
      </div>
    );
  }
  
  if (!planData) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
        <div className="text-center max-w-md w-full bg-black/40 border border-red-500/20 rounded-lg p-6 backdrop-blur-sm">
          <div className="mb-4">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-white">Plan Not Found</h2>
          <p className="mb-6 text-siso-text">
            We couldn't find a plan for username: "{username}".
            <br />
            Please make sure you have the correct URL.
          </p>
          <div className="space-y-3">
            <Button 
              onClick={() => window.history.back()} 
              variant="default"
            >
              Go Back
            </Button>
            <div>
              <Button 
                onClick={() => window.location.href = '/decora-plan'} 
                variant="outline" 
                className="mt-2"
              >
                Return to Plan Setup
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return <PlanContent />;
};

const PlanModalWrapper = () => {
  const { selectedPainPoint, showPainPointModal, setShowPainPointModal } = usePlanContext();
  
  // Make sure we only render the modal if we have a valid pain point with all required properties
  if (!selectedPainPoint) return null;
  
  // Create a properly formatted pain point object that matches the expected props
  const painPointProps = {
    problem: selectedPainPoint.problem || selectedPainPoint.title || "",
    statistic: selectedPainPoint.statistic || "",
    solution: selectedPainPoint.solution || "",
    detailedSolution: selectedPainPoint.detailedSolution || "",
    benefits: selectedPainPoint.benefits || [],
    metrics: selectedPainPoint.metrics || [],
    images: selectedPainPoint.images || [],
    caseStudyLink: selectedPainPoint.caseStudyLink || "#"
  };
  
  return (
    <PainPointsModal 
      open={showPainPointModal}
      onOpenChange={setShowPainPointModal}
      painPoint={painPointProps}
    />
  );
};

const Plan = () => {
  return (
    <PlanProvider>
      <div className="min-h-screen w-full bg-gradient-to-b from-black via-siso-bg to-black p-4 md:p-8">
        <div className="mx-auto max-w-5xl">
          <PlanWithContext />
        </div>
        <PlanModalWrapper />
      </div>
    </PlanProvider>
  );
};

export default Plan;
