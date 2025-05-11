import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ProjectHeader } from './details/ProjectHeader';
import { ProjectCardNavigation } from './details/ProjectCardNavigation';
import { ProjectOverviewCards } from './details/ProjectOverviewCards';
import { ProjectMetricsDashboard } from './details/ProjectMetricsDashboard';
import { ActiveTasksSection } from './details/ActiveTasksSection';
import { DevelopmentProgress } from './details/DevelopmentProgress';
import { AppPlanSection } from './details/AppPlanSection';
import { AgencyStepsSection } from './details/agency-steps/AgencyStepsSection';
import { FeatureRequestsSection } from './details/FeatureRequestsSection';
import { TimelineSection } from './details/TimelineSection';
import { FinancialSummarySection } from './details/FinancialSummarySection';
import { ResearchSection } from './details/ResearchSection';
import { ResearchDocumentDetail } from './details/research/ResearchDocumentDetail';
import { WireframeSection } from './details/WireframeSection';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export function ProjectDetails() {
  const { id, tab, documentId } = useParams<{ id?: string; tab?: string; documentId?: string }>();
  const location = useLocation();
  const projectId = id || 'ubahcrypt';
  const navigate = useNavigate();
  const activeTab = tab || 'overview';
  const contentRef = useRef<HTMLDivElement>(null);
  
  const [projectData, setProjectData] = useState({
    name: 'UbahCrypt Project',
    description: 'A revolutionary blockchain-based cryptocurrency platform with enhanced security features and cross-chain capabilities.',
    status: 'ACTIVE',
    created_at: '2025-04-01T10:00:00Z',
  });

  // Determine if we're on a research document detail page
  const isResearchDocumentDetail = location.pathname.includes('/market-research/') && documentId;

  // This would typically fetch project data from your API
  useEffect(() => {
    // Simulate API fetch
    // const fetchProject = async () => {
    //   const { data } = await supabase.from('projects').select('*').eq('id', projectId).single();
    //   if (data) setProjectData(data);
    // };
    // fetchProject();
    
    // For now using static data
  }, [projectId]);

  // Handle tab navigation with automatic scrolling
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeTab]);

  const renderAppPlanOverview = () => (
    <div ref={contentRef}>
      <AnimatedCard className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Crypto App Development Plan</h2>
        <p className="text-gray-300">
          This plan outlines the step-by-step process for developing the UbahCrypt application, 
          following the AI-Powered SaaS Development Best Practices Framework. The app will provide 
          users with features such as real-time crypto price tracking, portfolio management, and 
          secure transaction capabilities. Each phase leverages AI tools to enhance efficiency, quality, 
          and user satisfaction, tailored to the unique needs of a crypto app.
        </p>
      </AnimatedCard>
      
      <AppPlanSection />
    </div>
  );

  const renderTabContent = () => {
    // If we're on a research document detail page, render the detail component
    if (isResearchDocumentDetail) {
      return <ResearchDocumentDetail />;
    }

    switch (activeTab) {
      case 'overview':
        return renderAppPlanOverview();
      case 'agency-steps':
        return <AgencyStepsSection />;
      case 'market-research':
        return <ResearchSection />;
      case 'features':
        return <FeatureRequestsSection />;
      case 'wireframe':
        return (
          <div ref={contentRef}>
            <WireframeSection />
          </div>
        );
      case 'user-flow':
        // Use React Router navigation to avoid full page reload
        // This will properly navigate using the React Router context
        navigate(`/projects/${projectId}/userflow`);
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10" ref={contentRef}>
            <p>Redirecting to User Flow page...</p>
          </div>
        );
      case 'feedback-log':
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10" ref={contentRef}>
            <p>Feedback Log content is under development.</p>
          </div>
        );
      default:
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10" ref={contentRef}>
            <p>Content for {activeTab} tab is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <ProjectHeader 
        name={projectData.name} 
        description={projectData.description} 
        status={projectData.status} 
        created_at={projectData.created_at} 
      />
      {!isResearchDocumentDetail && <ProjectCardNavigation projectId={projectId} />}
      {renderTabContent()}
    </div>
  );
}
