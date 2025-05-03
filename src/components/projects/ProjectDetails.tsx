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
    phase: string,
    content: React.ReactNode
  ) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="col-span-1 mb-6 w-full"
    >
      <AnimatedCard className="h-full">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {icon}
              <h3 className="text-xl font-semibold text-white">{title}</h3>
            </div>
            <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
              {phase}
            </Badge>
          </div>
          
          <div className="prose prose-invert max-w-none">
            {content}
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
            secure transaction capabilities. Each phase leverages AI tools to enhance efficiency, quality, 
            and user satisfaction, tailored to the unique needs of a crypto app.
          </p>
        </AnimatedCard>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {renderDevelopmentPhaseCard(
          "1. Product Management", 
          <FileSpreadsheet className="w-6 h-6 text-purple-400" />,
          "Phase 1",
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-400">AI-Enhanced Ideation & Planning</h4>
            
            <div>
              <h5 className="text-md font-medium text-white">1.1 Ideation and Market Research with AI</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">AI Brainstorming:</span>
                  <span>Use AI tools like Ideamap or GPT-based assistants to generate ideas for the crypto app. Prompt the AI with: "Generate innovative features for a crypto app targeting retail investors." AI will suggest features like AI-driven price predictions, social sentiment analysis, or gamified portfolio challenges.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Market Analysis:</span>
                  <span>Deploy NLP-driven tools to analyze user reviews of existing crypto apps (e.g., Coinbase, Binance) and support tickets. Query: "What are the top pain points for crypto app users in 2025?" AI will identify issues like complex onboarding or lack of educational content, informing feature prioritization.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Data-Backed Validation:</span>
                  <span>Use generative AI to analyze crypto market reports and predict trends (e.g., growing demand for DeFi integration). Validate ideas by modeling user adoption scenarios, ensuring features align with market needs.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Actionable Steps:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Run AI brainstorming sessions to list 20+ feature ideas, then cluster them by user value.</li>
                <li>Analyze 5,000+ user reviews and support tickets from competitor apps to identify top 5 pain points.</li>
                <li>Validate top 3 features using AI-driven market trend analysis and user adoption modeling.</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-md font-medium text-white">1.2 Roadmapping and Requirements Gathering</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">AI-Powered Prioritization:</span>
                  <span>Use Zeda.io's AI roadmap planner to prioritize features based on user impact, business value, and development effort. Feed historical data: "Which crypto app features drove retention in 2024?" to align priorities with proven drivers.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Automated Requirements:</span>
                  <span>Input high-level feature ideas (e.g., "portfolio tracker") into AI tools to generate detailed user stories and functional specifications, covering edge cases like offline access or multi-wallet support.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Continuous Feedback Loop:</span>
                  <span>Set up AI to analyze user feedback and usage data every sprint, dynamically adjusting the roadmap. For example, if users request more DeFi features, reprioritize accordingly.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Best Practices:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Use AI brainstorming to explore diverse feature ideas and reduce bias.</li>
                <li>Leverage NLP to mine user feedback for actionable insights.</li>
                <li>Auto-generate PRDs with AI, then validate with human review.</li>
                <li>Maintain a continuous feedback loop to keep the roadmap data-driven.</li>
              </ul>
            </div>
          </div>
        )}
        
        {renderDevelopmentPhaseCard(
          "2. UX/UI Design", 
          <Framer className="w-6 h-6 text-purple-400" />,
          "Phase 2",
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-400">AI-Assisted Design and Usability</h4>
            
            <div>
              <h5 className="text-md font-medium text-white">2.1 AI-Driven Wireframing & Prototyping</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Instant Prototypes:</span>
                  <span>Use Uizard or Lovable to convert sketches or descriptions (e.g., "crypto dashboard with price charts") into high-fidelity wireframes. AI outputs React or HTML/CSS code for rapid front-end development.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Design Best Practices Built-In:</span>
                  <span>Ensure AI enforces accessibility (e.g., high-contrast price charts for vision-impaired users) and UX standards (e.g., clear navigation for portfolio management).</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Lovable & Bolt for UI:</span>
                  <span>Use Lovable to generate a functional UI with components like price tickers and transaction forms. Refine output to align with crypto app branding (e.g., dark mode for traders).</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Actionable Steps:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Create initial wireframes for 3 key screens (dashboard, portfolio, transaction) using AI tools.</li>
                <li>Run AI accessibility checks to ensure compliance with WCAG standards.</li>
                <li>Generate a functional UI prototype with Lovable, then customize for brand consistency.</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-md font-medium text-white">2.2 AI in User Research & Usability Testing</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Synthetic User Testing:</span>
                  <span>Use AI agents to simulate user interactions (e.g., navigating portfolio or initiating a transaction) and identify friction points, like unclear wallet connection steps.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Automated Feedback Analysis:</span>
                  <span>Analyze beta tester feedback with NLP to categorize themes (e.g., "confusing transaction flow"). Identify subtle issues, like slow chart updates, that impact engagement.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">AI-Augmented A/B Testing:</span>
                  <span>Generate design variants (e.g., different chart layouts) and analyze A/B test results to optimize for user segments (e.g., novice vs. expert traders).</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Continuous UX Improvement:</span>
                  <span>Integrate AI-driven analytics (e.g., Hotjar) to monitor live user interactions and detect issues like rage clicks on transaction buttons.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Best Practices:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Use AI prototyping for rapid mocks, then refine with human creativity.</li>
                <li>Ensure accessibility with AI checks, verified by designers.</li>
                <li>Leverage AI for synthetic and real user feedback analysis.</li>
                <li>Embrace A/B testing with AI to optimize designs iteratively.</li>
              </ul>
            </div>
          </div>
        )}
        
        {renderDevelopmentPhaseCard(
          "3. Development", 
          <Code className="w-6 h-6 text-purple-400" />,
          "Phase 3",
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-400">AI-Augmented Coding and Collaboration</h4>
            
            <div>
              <h5 className="text-md font-medium text-white">3.1 Coding with AI Assistance</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">AI Pair Programming:</span>
                  <span>Integrate GitHub Copilot or Cursor into the IDE to autocomplete code for features like real-time price APIs or wallet integration. AI handles boilerplate, freeing developers for complex logic.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Code Generation Platforms:</span>
                  <span>Use Bolt.new to scaffold a full-stack crypto app (e.g., React front-end, Node.js backend) from a prompt like "build a crypto price tracker with portfolio." Engineers refine for security and scalability.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Version Control & Merging:</span>
                  <span>Use AI to write commit messages, resolve simple merge conflicts, and enforce conventional commit standards.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Actionable Steps:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Set up Copilot or Cursor for all developers to boost coding speed by 20%.</li>
                <li>Generate a full-stack prototype with Bolt.new, then refine for production use.</li>
                <li>Implement AI-driven commit message generation and merge conflict resolution in Git workflow.</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-md font-medium text-white">3.2 Collaboration and Code Quality</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">AI Code Review:</span>
                  <span>Use Codiga or DeepSource to inspect code for bugs, security vulnerabilities (e.g., API key leaks), and performance issues. AI flags issues before human review.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Knowledge Sharing:</span>
                  <span>Enable junior developers to query AI for code snippets or explanations, reducing reliance on seniors. AI generates documentation for complex modules like transaction processing.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Pairing Non-Coders with AI:</span>
                  <span>Allow PMs to use Lovable to prototype simple features (e.g., price alerts), which developers polish later.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Best Practices:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Use AI in IDEs for real-time coding assistance.</li>
                <li>Generate prototypes with AI platforms, refined by engineers.</li>
                <li>Include AI code review in CI for quality assurance.</li>
                <li>Document with AI to keep knowledge accessible.</li>
                <li>Train team on AI tools, emphasizing human validation.</li>
              </ul>
            </div>
          </div>
        )}
        
        {renderDevelopmentPhaseCard(
          "4. Testing", 
          <TestTube className="w-6 h-6 text-purple-400" />,
          "Phase 4",
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-400">Automated and AI-Driven QA</h4>
            
            <div>
              <h5 className="text-md font-medium text-white">4.1 Unit and Integration Testing with AI</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Test Case Generation:</span>
                  <span>Use AI to generate unit tests for critical functions (e.g., transaction validation). Tools like Diffblue Cover create JUnit tests for backend logic.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Natural Language to Test:</span>
                  <span>Write test scenarios in plain English (e.g., "User transfers 0.1 BTC successfully") and let AI convert to Selenium scripts.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Adaptive Test Suites:</span>
                  <span>Use AI to prioritize tests based on code changes, updating suites for UI or API modifications.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Integration and API Testing:</span>
                  <span>Simulate API interactions (e.g., price feed APIs) with AI to test edge cases like rate limits or invalid responses.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Actionable Steps:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Generate unit tests for 80% of backend logic using AI, reviewed by QA.</li>
                <li>Convert 10 plain-language scenarios to automated tests with AI.</li>
                <li>Update test suites bi-weekly with AI to maintain 90% coverage.</li>
                <li>Run AI-driven API tests to cover 100+ edge cases.</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-md font-medium text-white">4.2 Performance, Security, and UX Testing</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Performance Testing:</span>
                  <span>Use AI to simulate peak loads (e.g., 1,000 concurrent price requests) and identify bottlenecks, like slow database queries.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Visual Regression & UX Testing:</span>
                  <span>Implement Applitools Eyes to detect UI bugs (e.g., misaligned charts) across browsers. AI assesses UX flows for efficiency.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">AI for Security Testing:</span>
                  <span>Scan code for vulnerabilities (e.g., XSS in transaction forms) and simulate attacks with AI fuzz testing.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Self-Healing and Defect Prediction:</span>
                  <span>Use AI to pinpoint failure causes (e.g., null pointer in wallet module) and predict defect-prone areas.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Best Practices:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Auto-generate and review tests for critical paths.</li>
                <li>Use NLP to simplify test case design.</li>
                <li>Update tests with AI to stay relevant.</li>
                <li>Include AI performance and security testing in CI.</li>
                <li>Automate visual and UX testing with AI.</li>
                <li>Treat AI as a QA co-pilot, with human oversight.</li>
              </ul>
            </div>
          </div>
        )}
        
        {renderDevelopmentPhaseCard(
          "5. Deployment & Monitoring", 
          <CloudCog className="w-6 h-6 text-purple-400" />,
          "Phase 5",
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-400">Intelligent CI/CD and AIOps</h4>
            
            <div>
              <h5 className="text-md font-medium text-white">5.1 AI-Driven CI/CD Pipelines</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Automated Build & Test Pipelines:</span>
                  <span>Use AI to run relevant tests based on code changes, reducing CI time by 30%.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Predictive Failure Detection:</span>
                  <span>Analyze CI logs to flag risky commits (e.g., updates to transaction logic likely to fail).</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Resource Optimization:</span>
                  <span>Use AI to scale CI resources dynamically, saving 20% on cloud costs.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Security and Compliance:</span>
                  <span>Monitor pipelines for anomalies (e.g., unauthorized dependency changes) and ensure crypto-specific compliance (e.g., KYC/AML).</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Actionable Steps:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Optimize CI pipeline with AI to run targeted tests, cutting build time by 30%.</li>
                <li>Set up AI failure prediction to flag 80% of risky commits.</li>
                <li>Reduce CI costs by 20% with AI resource optimization.</li>
                <li>Scan pipelines for security and compliance issues daily.</li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-md font-medium text-white">5.2 Monitoring, Observability, and Feedback Loops</h5>
              <ul className="mt-2 space-y-2">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">AI-Enhanced Observability:</span>
                  <span>Use AI to detect anomalies in metrics (e.g., unusual transaction volumes) and logs, catching issues before users notice.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Incident Response (AIOps):</span>
                  <span>Implement AIOps to correlate incidents (e.g., API errors and CPU spikes) and suggest fixes, reducing MTTR by 50%.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">User Feedback Loop:</span>
                  <span>Analyze user behavior (e.g., low engagement with portfolio tools) and support tickets with AI to inform feature updates.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Continuous Learning:</span>
                  <span>Monitor AI-driven features (e.g., price predictions) for drift and trigger retraining if accuracy drops below 90%.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Best Practices:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Build AI-driven CI pipelines for efficiency.</li>
                <li>Use AI for intelligent rollouts and rollbacks.</li>
                <li>Enable AI anomaly detection for proactive monitoring.</li>
                <li>Adopt AIOps for faster incident resolution.</li>
                <li>Close feedback loops with AI-driven user insights.</li>
              </ul>
            </div>
          </div>
        )}
        
        {renderDevelopmentPhaseCard(
          "6. Implementation Guidelines", 
          <FileCheck className="w-6 h-6 text-purple-400" />,
          "Phase 6",
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-purple-400">Strategic Approach for AI Implementation</h4>
            
            <div>
              <ul className="mt-2 space-y-4">
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Assess Toolchain:</span>
                  <span>Select AI tools for each phase (e.g., Ideamap for PM, Uizard for design, Copilot for dev, Applitools for QA, AIOps for monitoring). Ensure tools comply with crypto app security standards.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Upskill Team:</span>
                  <span>Train team on AI tools via workshops, focusing on prompting techniques and validating AI outputs. Run a hackathon to build confidence.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Start Small, Then Scale:</span>
                  <span>Begin with AI code review on one module, then expand to full pipeline. Refine processes before company-wide adoption.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Embed AI in Process:</span>
                  <span>Update SDLC to include AI checks (e.g., AI accessibility for designs, AI static analysis for code). Make AI a checklist item.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-medium text-purple-400">Maintain Oversight:</span>
                  <span>Require human review for all AI outputs (e.g., code, tests, designs). Ensure compliance with GDPR and crypto regulations for user data.</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-black/30 p-4 rounded-md">
              <h5 className="text-md font-medium text-white">Actionable Steps:</h5>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                <li>Audit toolchain and select 5 AI tools by week 2.</li>
                <li>Train team on AI tools by week 4, with 100% participation.</li>
                <li>Pilot AI code review on one module by week 6, scale by week 12.</li>
                <li>Update SDLC with AI checks by week 8.</li>
                <li>Implement human review and compliance checks for all AI outputs.</li>
              </ul>
            </div>
          </div>
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
