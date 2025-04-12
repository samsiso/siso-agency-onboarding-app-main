
import { useParams } from 'react-router-dom';
import { usePlanData } from '@/hooks/usePlanData';
import { PlanProvider } from '@/contexts/plan/PlanContext';
import { MessageLoading } from '@/components/ui/message-loading';
import { PlanContent } from '@/components/plan/PlanContent';
import { PainPointsModal } from '@/components/plan/PainPointsModal';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { usePlanContext } from '@/contexts/plan/PlanContext';

// This is a wrapper component that provides the PlanContext
const PlanWithContext = () => {
  const { username } = useParams<{ username: string }>();
  const { loading, planData, setPlanData } = usePlanData(username);
  const navigate = useNavigate();
  
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
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-bold text-white">Plan Not Found</h2>
          <p className="mb-6 text-siso-text">We couldn't find a plan for this username.</p>
          <Button onClick={() => navigate('/')} variant="default">
            Go Home
          </Button>
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
