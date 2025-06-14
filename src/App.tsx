import { Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';
import Index from './pages/Index';
import TestPage from './pages/TestPage';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import OnboardingSocial from './pages/onboarding/social';
import { Toaster } from '@/components/ui/toaster';
import OnboardingChat from './pages/OnboardingChat';
import ThankYou from './pages/ThankYou';
import ThankYouPlan from './pages/ThankYou';
import Plan from './pages/Plan';
import DecoraPlan from './pages/DecoraPlan';
import PublicPlanView from './pages/PublicPlanView';
import Congratulations from './pages/onboarding/congratulations';
import Home from './pages/Home';
import CryptoExchange from './pages/CryptoExchange';
import HowToEarn from './pages/HowToEarn';
import LeaderboardPage from './pages/LeaderboardPage';
import { AuthGuard } from './components/auth/AuthGuard';
import MyProjects from './pages/MyProjects';
import AdminPlans from './pages/AdminPlans';
import AdminOutreach from './pages/AdminOutreach';
import AdminTemplates from './pages/AdminTemplates';
import AdminTeams from './pages/AdminTeams';
import Portfolio from './pages/Portfolio';
import PublicPortfolio from './pages/PublicPortfolio';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminPayments from './pages/AdminPayments';
import AdminDailyPlanner from './pages/AdminDailyPlanner';
import ClientDetailPage from './pages/ClientDetailPage';
import AdminTasks from './pages/AdminTasks';
import AdminSettings from './pages/AdminSettings';
import AdminPrompts from './pages/AdminPrompts';
import { TeamMemberTasksView } from './components/admin/tasks/TeamMemberTasksView';
import TeamMemberTasksPage from './pages/TeamMemberTasksPage';
import ClientDashboard from "./pages/ClientDashboard";
import ClientDocumentsPage from "./pages/client/ClientDocumentsPage";
import ClientTasksPage from "./pages/client/ClientTasksPage";
import ClientStatusPage from "./pages/client/ClientStatusPage";
import ClientSupportPage from "./pages/client/ClientSupportPage";
import ProjectsAndTasksPage from './pages/ProjectsAndTasksPage';
import DocumentLibraryPage from './pages/resources/DocumentLibraryPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import TimelinePage from './pages/TimelinePage';
import Communication from './pages/Communication';
import AppPlan from './pages/AppPlan';
import AppPlanTestingDashboard from '@/components/debug/AppPlanTestingDashboard';
import DebugPage from './pages/debug';

// Financial & Account section
import PaymentsPage from './pages/financial/PaymentsPage';
import LeaderboardsPage from './pages/financial/LeaderboardsPage';
import FinancialProfilePage from './pages/financial/FinancialProfilePage';
import ClientAppDetailsPage from './pages/ClientAppDetailsPage';
import AdminWireframes from './pages/AdminWireframes';
import UserFlow from './pages/UserFlow';
import AdminUserFlow from './pages/AdminUserFlow';
import UserFlowFeedbackPage from './pages/projects/UserFlowFeedbackPage';
import UserFlowNodesPage from './pages/projects/UserFlowNodesPage';
import UserFlowCodePage from './pages/projects/UserFlowCodePage';
import ProjectOnboardingPage from './pages/ProjectOnboardingPage';
import { BusinessOnboarding } from './components/onboarding/BusinessOnboarding';
import PartnershipPage from './pages/PartnershipPage';

// Partner Dashboard & Auth imports
import PartnerLogin from './pages/auth/PartnerLogin';
import PartnerRegister from './pages/auth/PartnerRegister';
import PartnerPasswordReset from './pages/auth/PartnerPasswordReset';
import PartnerDashboard from './pages/dashboard/PartnerDashboard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import { PartnerAuthGuard } from './components/auth/PartnerAuthGuard';
import { PartnerLeaderboard } from './components/dashboard/PartnerLeaderboard';
import { ComingSoonSection } from './components/dashboard/ComingSoonSection';

function ErrorFallback({error, resetErrorBoundary}: {error: Error, resetErrorBoundary: () => void}) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
        <p className="text-gray-400">There was an error loading this page</p>
        <button 
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-[#ea384c] text-white rounded hover:bg-[#d42c47]"
        >
          Try again
        </button>
        <div className="mt-4">
          <a 
            href="/testing" 
            className="text-[#ea384c] hover:underline"
          >
            🧪 Access AI Testing Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Toaster />
      <ErrorBoundary 
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.reload()}
      >
        <Routes>
          {/* Test route for diagnosis */}
          <Route path="/test" element={<TestPage />} />
          
          {/* Public routes */}
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/portfolio" element={<PublicPortfolio />} />
          <Route path="/partnership" element={<PartnershipPage />} />
          <Route path="/partners" element={<PartnershipPage />} />
          <Route path="/partner" element={<PartnershipPage />} />
          
          {/* Partner Authentication Routes */}
          <Route path="/auth/login" element={<PartnerLogin />} />
          <Route path="/auth/register" element={<PartnerRegister />} />
          <Route path="/auth/reset-password" element={<PartnerPasswordReset />} />
          
          {/* Partner Dashboard Routes */}
          <Route path="/dashboard" element={<PartnerAuthGuard><DashboardLayout /></PartnerAuthGuard>}>
            <Route index element={<PartnerDashboard />} />
            <Route path="coming-soon" element={<div className="p-6"><ComingSoonSection /></div>} />
            <Route path="education" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Education Hub</h1><p className="text-gray-400 mt-2">Learning resources and training materials coming soon.</p></div>} />
            <Route path="templates" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Templates</h1><p className="text-gray-400 mt-2">Ready-to-use templates for your projects.</p></div>} />
            <Route path="app-plan-generator" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">App Plan Generator</h1><p className="text-gray-400 mt-2">AI-powered app planning tool coming soon.</p></div>} />
            <Route path="pipeline" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Pipeline</h1><p className="text-gray-400 mt-2">Track your referral pipeline and progress.</p></div>} />
            <Route path="profile" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Profile Settings</h1><p className="text-gray-400 mt-2">Manage your partner profile and preferences.</p></div>} />
            
            {/* Legacy routes for backward compatibility */}
            <Route path="referrals" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Referrals - Coming Soon</h1></div>} />
            <Route path="earnings" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Earnings - Coming Soon</h1></div>} />
            <Route path="leaderboard" element={<PartnerLeaderboard />} />
            <Route path="resources" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Resources - Coming Soon</h1></div>} />
            <Route path="goals" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Goals & Targets - Coming Soon</h1></div>} />
            <Route path="achievements" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Achievements - Coming Soon</h1></div>} />
            <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold text-white">Settings - Coming Soon</h1></div>} />
          </Route>
          <Route path="/partner-dashboard" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard/partner" element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/onboarding-chat" element={<OnboardingChat />} />
          <Route path="/onboarding" element={<AuthGuard><BusinessOnboarding /></AuthGuard>} />
          <Route path="/thankyou" element={<ThankYou />} />
          <Route path="/thankyou-plan" element={<ThankYouPlan />} />
          {/* Shareable app plans route - must come before generic plan route */}
          <Route path="/plan/share/:slug" element={<PublicPlanView />} />
          {/* User-specific plans route */}
          <Route path="/plan/:username" element={<Plan />} />
          <Route path="/decora-plan" element={<DecoraPlan />} />

          {/* App Plan Generator Route */}
          <Route path="/app-plan" element={<AuthGuard><AppPlan /></AuthGuard>} />
          
          {/* Dynamic App Plan Routes - username-based saved plans */}
          <Route path="/app-plan/:username" element={<AppPlan />} />
          
          {/* Admin routes - using adminOnly prop to enforce admin access */}
          <Route path="/admin" element={<AuthGuard adminOnly={true}><AdminDashboard /></AuthGuard>} />
          <Route path="/admin/dashboard" element={<AuthGuard adminOnly={true}><AdminDashboard /></AuthGuard>} />
          <Route path="/admin/clients" element={<AuthGuard adminOnly={true}><AdminClients /></AuthGuard>} />
          <Route path="/admin/clients/:clientId" element={<AuthGuard adminOnly={true}><ClientDetailPage /></AuthGuard>} />
          <Route path="/admin/prompts" element={<AuthGuard adminOnly={true}><AdminPrompts /></AuthGuard>} />
          <Route path="/admin/outreach" element={<AuthGuard adminOnly={true}><AdminOutreach /></AuthGuard>} />
          <Route path="/admin/templates" element={<AuthGuard adminOnly={true}><AdminTemplates /></AuthGuard>} />
          <Route path="/admin/teams" element={<AuthGuard adminOnly={true}><AdminTeams /></AuthGuard>} />
          <Route path="/admin/payments" element={<AuthGuard adminOnly={true}><AdminPayments /></AuthGuard>} />
          <Route path="/admin/daily-planner" element={<AuthGuard adminOnly={true}><AdminDailyPlanner /></AuthGuard>} />
          <Route path="/admin/tasks" element={<AuthGuard adminOnly={true}><AdminTasks /></AuthGuard>} />
          <Route path="/admin/tasks/:memberId" element={<AuthGuard adminOnly={true}><TeamMemberTasksPage /></AuthGuard>} />
          <Route path="/admin/settings" element={<AuthGuard adminOnly={true}><AdminSettings /></AuthGuard>} />
          <Route path="/admin/plans/create" element={<AuthGuard adminOnly={true}><AdminPlans /></AuthGuard>} />
          <Route path="/admin/plans/:planId/edit" element={<AuthGuard adminOnly={true}><AdminPlans /></AuthGuard>} />
          <Route path="/admin/wireframes" element={<AuthGuard adminOnly={true}><AdminWireframes /></AuthGuard>} />
          <Route path="/admin/wireframes/:projectId" element={<AuthGuard adminOnly={true}><AdminWireframes /></AuthGuard>} />
          <Route path="/admin/userflow" element={<AuthGuard adminOnly={true}><AdminUserFlow /></AuthGuard>} />
          <Route path="/admin/userflow/:projectId" element={<AuthGuard adminOnly={true}><UserFlow /></AuthGuard>} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
          
          {/* Protected Project Routes */}
          <Route path="/projects" element={<AuthGuard><ProjectsAndTasksPage /></AuthGuard>} />
          <Route path="/projects/tasks" element={<AuthGuard><ProjectsAndTasksPage /></AuthGuard>} />
          <Route path="/projects/timeline" element={<AuthGuard><TimelinePage /></AuthGuard>} />
          <Route path="/projects/plan-features" element={<AuthGuard><ProjectDetailsPage /></AuthGuard>} />
          <Route path="/projects/new" element={<AuthGuard><ProjectOnboardingPage /></AuthGuard>} />
          
          {/* Key route order - specific routes must come before the generic routes */}
          <Route path="/projects/:id/userflow" element={<AuthGuard><UserFlow /></AuthGuard>} />
          <Route path="/projects/:projectId/userflow/feedback" element={<AuthGuard><UserFlowFeedbackPage /></AuthGuard>} />
          <Route path="/projects/:projectId/userflow/nodes" element={<AuthGuard><UserFlowNodesPage /></AuthGuard>} />
          <Route path="/projects/:projectId/userflow/code" element={<AuthGuard><UserFlowCodePage /></AuthGuard>} />
          
          {/* Redirect routes for compatibility */}
          <Route path="/projects/:id/feedback-log" element={<AuthGuard><Navigate to={`/projects/${window.location.pathname.split('/')[2]}/userflow/feedback`} replace /></AuthGuard>} />
          
          {/* Handle both wireframe (singular) and wireframes (plural) routes */}
          <Route path="/projects/:id/wireframe" element={<AuthGuard><ProjectDetailsPage tab="wireframes" /></AuthGuard>} />
          <Route path="/projects/:id/wireframes" element={<AuthGuard><ProjectDetailsPage tab="wireframes" /></AuthGuard>} />
          
          <Route path="/projects/:id/market-research/:documentId" element={<AuthGuard><ProjectDetailsPage /></AuthGuard>} />
          <Route path="/projects/:id" element={<AuthGuard><ProjectDetailsPage /></AuthGuard>} />
          <Route path="/projects/:id/:tab" element={<AuthGuard><ProjectDetailsPage /></AuthGuard>} />
          
          <Route path="/my-projects" element={<AuthGuard><MyProjects /></AuthGuard>} />
          <Route path="/plan-builder" element={<AuthGuard><Communication /></AuthGuard>} />
          <Route path="/admin/portfolio" element={<AuthGuard><Portfolio /></AuthGuard>} />
          
          {/* Financial Routes */}
          <Route path="/financial/payments" element={<AuthGuard><PaymentsPage /></AuthGuard>} />
          <Route path="/financial/leaderboards" element={<AuthGuard><LeaderboardPage /></AuthGuard>} />
          
          {/* Account & Resources Routes */}
          <Route path="/profile" element={<AuthGuard><FinancialProfilePage /></AuthGuard>} />
          <Route path="/resources" element={<AuthGuard><ResourcesPage /></AuthGuard>} />
          <Route path="/resources/documents" element={<AuthGuard><DocumentLibraryPage /></AuthGuard>} />
          
          {/* Redirect legacy routes */}
          <Route path="/financial/profile" element={<AuthGuard><Navigate to="/profile" replace /></AuthGuard>} />
          <Route path="/help" element={<AuthGuard><Navigate to="/resources" replace /></AuthGuard>} />
          <Route path="/settings" element={<AuthGuard><Navigate to="/profile" replace /></AuthGuard>} />
          <Route path="/resources/help" element={<AuthGuard><Navigate to="/resources" replace /></AuthGuard>} />
          <Route path="/resources/help/getting-started" element={<AuthGuard><ResourcesPage /></AuthGuard>} />
          <Route path="/resources/help/documentation" element={<AuthGuard><ResourcesPage /></AuthGuard>} />
          <Route path="/resources/help/faq" element={<AuthGuard><ResourcesPage /></AuthGuard>} />
          
          {/* Client App Details Route */}
          <Route path="/client-app/:clientId" element={<AuthGuard><ClientAppDetailsPage /></AuthGuard>} />
          
          {/* Legacy Financial Routes (redirected for backward compatibility) */}
          <Route path="/payments" element={<AuthGuard><PaymentsPage /></AuthGuard>} />
          <Route path="/economy/earn" element={<AuthGuard><HowToEarn /></AuthGuard>} />
          <Route path="/economy/leaderboards" element={<AuthGuard><LeaderboardPage /></AuthGuard>} />
          
          {/* Client Dashboard Routes - accessible to all authenticated users but with conditional content */}
          <Route path="/client-dashboard" element={<AuthGuard><ClientDashboard /></AuthGuard>} />
          <Route path="/client-dashboard/documents" element={<AuthGuard><ClientDocumentsPage /></AuthGuard>} />
          <Route path="/client-dashboard/tasks" element={<AuthGuard><ClientTasksPage /></AuthGuard>} />
          <Route path="/client-dashboard/status" element={<AuthGuard><ClientStatusPage /></AuthGuard>} />
          <Route path="/client-dashboard/support" element={<AuthGuard><ClientSupportPage /></AuthGuard>} />

          {/* Testing Dashboard Route */}
          <Route path="/testing" element={<AppPlanTestingDashboard />} />
          
          {/* Debug Dashboard Route */}
          <Route path="/debug" element={<DebugPage />} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
