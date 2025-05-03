
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProjectHeader } from './details/ProjectHeader';
import { ProjectCardNavigation } from './details/ProjectCardNavigation';
import { ProjectOverviewCards } from './details/ProjectOverviewCards';
import { ProjectMetricsDashboard } from './details/ProjectMetricsDashboard';
import { ActiveTasksSection } from './details/ActiveTasksSection';
import { DevelopmentProgress } from './details/DevelopmentProgress';
import { AppPlanSection } from './details/AppPlanSection';
import { FeatureRequestsSection } from './details/FeatureRequestsSection';
import { TimelineSection } from './details/TimelineSection';
import { FinancialSummarySection } from './details/FinancialSummarySection';
import { ResearchSection } from './details/ResearchSection';
import { AnimatedCard } from '@/components/ui/animated-card';
import { FileCheck, Framer, Code, TestTube, CloudCog, FileSpreadsheet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function ProjectDetails() {
  const { id, tab } = useParams<{ id?: string; tab?: string }>();
  const projectId = id || 'ubahcrypt';
  const activeTab = tab || 'overview';
  
  const [projectData, setProjectData] = useState({
    name: 'UbahCrypt Project',
    description: 'A revolutionary blockchain-based cryptocurrency platform with enhanced security features and cross-chain capabilities.',
    status: 'ACTIVE',
    created_at: '2025-04-01T10:00:00Z',
  });

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

  const renderDevelopmentPhaseCard = (
    title: string, 
    icon: React.ReactNode, 
    description: string, 
    points: string[], 
    badgeText: string
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-1"
    >
      <AnimatedCard className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              {badgeText}
            </Badge>
          </div>
          
          <p className="text-gray-300 mb-4">{description}</p>
          
          <div className="space-y-2 flex-grow">
            {points.map((point, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="text-purple-400 mt-1">•</div>
                <p className="text-gray-400 text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedCard>
    </motion.div>
  );

  const renderAppPlanOverview = () => (
    <div className="space-y-6">
      <div className="mb-8">
        <AnimatedCard>
          <h2 className="text-2xl font-bold text-white mb-4">Crypto App Development Plan</h2>
          <p className="text-gray-300">
            This plan outlines the step-by-step process for developing the UbahCrypt application, 
            following the AI-Powered SaaS Development Best Practices Framework. The app will provide 
            users with features such as real-time crypto price tracking, portfolio management, and 
            secure transaction capabilities.
          </p>
        </AnimatedCard>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderDevelopmentPhaseCard(
          "Product Management", 
          <FileSpreadsheet className="w-6 h-6 text-purple-400" />,
          "AI-Enhanced Ideation & Planning for the UbahCrypt platform.",
          [
            "AI Brainstorming for innovative crypto features and capabilities",
            "Market Analysis using NLP-driven tools to analyze competitor reviews",
            "Data-Backed Validation with generative AI to predict market trends",
            "AI-Powered Prioritization for feature roadmapping"
          ],
          "Phase 1"
        )}
        
        {renderDevelopmentPhaseCard(
          "UX/UI Design", 
          <Framer className="w-6 h-6 text-purple-400" />,
          "AI-Assisted Design and Usability optimization for intuitive experiences.",
          [
            "Instant Prototypes with Uizard or Lovable for rapid wireframing",
            "Design Best Practices with built-in accessibility standards",
            "Synthetic User Testing with AI agents to identify friction points",
            "AI-Augmented A/B Testing to optimize for user segments"
          ],
          "Phase 2"
        )}
        
        {renderDevelopmentPhaseCard(
          "Development", 
          <Code className="w-6 h-6 text-purple-400" />,
          "AI-Augmented Coding and Collaboration for efficient development.",
          [
            "AI Pair Programming with GitHub Copilot or Cursor",
            "Code Generation Platforms to scaffold full-stack crypto functionality",
            "AI Code Review using Codiga or DeepSource for quality assurance",
            "Knowledge Sharing to reduce dependency on senior developers"
          ],
          "Phase 3"
        )}
        
        {renderDevelopmentPhaseCard(
          "Testing", 
          <TestTube className="w-6 h-6 text-purple-400" />,
          "Automated and AI-Driven QA processes for reliable performance.",
          [
            "Test Case Generation for critical transaction validation functions",
            "Natural Language to Test conversion for simplified test creation",
            "Performance Testing to simulate peak loads and identify bottlenecks",
            "AI for Security Testing to scan for vulnerabilities"
          ],
          "Phase 4"
        )}
        
        {renderDevelopmentPhaseCard(
          "Deployment & Monitoring", 
          <CloudCog className="w-6 h-6 text-purple-400" />,
          "Intelligent CI/CD and AIOps for smooth operation.",
          [
            "Automated Build & Test Pipelines to reduce CI time by 30%",
            "Predictive Failure Detection to flag risky commits",
            "AI-Enhanced Observability to detect anomalies in metrics",
            "Incident Response with AIOps to correlate incidents"
          ],
          "Phase 5"
        )}
        
        {renderDevelopmentPhaseCard(
          "Implementation Guidelines", 
          <FileCheck className="w-6 h-6 text-purple-400" />,
          "Strategic approach for successfully implementing AI tools.",
          [
            "Assess Toolchain to select AI tools compliant with security standards",
            "Upskill Team through workshops on AI prompting techniques",
            "Start Small, Then Scale beginning with AI code review on one module",
            "Maintain Oversight with human review of all AI outputs"
          ],
          "Phase 6"
        )}
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderAppPlanOverview();
      case 'agency-steps':
        return <AppPlanSection />;
      case 'market-research':
        return <ResearchSection />;
      case 'features':
        return <FeatureRequestsSection />;
      case 'wireframe':
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10">
            <p>Wireframe content is under development.</p>
          </div>
        );
      case 'user-flow':
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10">
            <p>User Flow content is under development.</p>
          </div>
        );
      case 'feedback-log':
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10">
            <p>Feedback Log content is under development.</p>
          </div>
        );
      default:
        return (
          <div className="p-6 text-center text-neutral-400 bg-black/30 rounded-lg border border-white/10">
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
      <ProjectCardNavigation projectId={projectId} />
      {renderTabContent()}
    </div>
  );
}
