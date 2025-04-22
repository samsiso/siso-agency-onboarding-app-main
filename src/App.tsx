import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import OnboardingSocial from './pages/onboarding/social';
import { Toaster } from '@/components/ui/toaster';
import OnboardingChat from './pages/OnboardingChat';
import ThankYou from './pages/ThankYou';
import ThankYouPlan from './pages/ThankYouPlan';
import Plan from './pages/Plan';
import DecoraPlan from './pages/DecoraPlan';
import Congratulations from './pages/onboarding/congratulations';
import Home from './pages/Home';
import CryptoExchange from './pages/CryptoExchange';
import HowToEarn from './pages/HowToEarn';
import LeaderboardPage from './pages/LeaderboardPage';
import HelpPage from './pages/HelpPage';
import { AuthGuard } from './components/auth/AuthGuard';
import MyProjects from './pages/MyProjects';
import AdminPlans from './pages/AdminPlans';
import AdminOutreach from './pages/AdminOutreach';
import AdminTemplates from './pages/AdminTemplates';
import AdminTeams from './pages/AdminTeams';
import Portfolio from './pages/Portfolio';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminPayments from './pages/AdminPayments';
import AdminDailyPlanner from './pages/AdminDailyPlanner';
import ClientDetailPage from './pages/ClientDetailPage';
import AdminTasks from './pages/AdminTasks';
import AdminSettings from './pages/AdminSettings';
import { TeamMemberTasksView } from './components/admin/tasks/TeamMemberTasksView';
import TeamMemberTasksPage from './pages/TeamMemberTasksPage';
import ChangelogPage from './pages/Changelog';
import ClientPortalLogin from "./pages/ClientPortalLogin";
import ClientDashboard from "./pages/ClientDashboard";
import { ClientRoute } from "./components/auth/ClientRoute";

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding-chat" element={<OnboardingChat />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/thankyou-plan" element={<ThankYouPlan />} />
        <Route path="/plan/:username" element={<Plan />} />
        <Route path="/decora-plan" element={<DecoraPlan />} />
        
        {/* Admin routes - using adminOnly prop to enforce admin access */}
        <Route path="/admin" element={<AuthGuard adminOnly={true}><AdminDashboard /></AuthGuard>} />
        <Route path="/admin/clients" element={<AuthGuard adminOnly={true}><AdminClients /></AuthGuard>} />
        <Route path="/admin/clients/:clientId" element={<AuthGuard adminOnly={true}><ClientDetailPage /></AuthGuard>} />
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
        
        {/* Protected routes */}
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/onboarding/social" element={<AuthGuard><OnboardingSocial /></AuthGuard>} />
        <Route path="/onboarding/congratulations" element={<AuthGuard><Congratulations /></AuthGuard>} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/home" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><Home /></AuthGuard>} />
        
        {/* Protected Project Routes */}
        <Route path="/plan-builder" element={<AuthGuard><Home /></AuthGuard>} />
        <Route path="/my-projects" element={<AuthGuard><MyProjects /></AuthGuard>} />
        <Route path="/portfolio" element={<AuthGuard><Portfolio /></AuthGuard>} />
        
        {/* Protected Financial Routes */}
        <Route path="/payments" element={<AuthGuard><CryptoExchange /></AuthGuard>} />
        <Route path="/economy/earn" element={<AuthGuard><HowToEarn /></AuthGuard>} />
        <Route path="/economy/leaderboards" element={<AuthGuard><LeaderboardPage /></AuthGuard>} />
        
        {/* Protected Support & Settings Routes */}
        <Route path="/help" element={<AuthGuard><HelpPage /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/changelog" element={<AuthGuard><ChangelogPage /></AuthGuard>} />

        {/* Client Portal routes */}
        <Route path="/client-portal" element={<ClientPortalLogin />} />
        <Route path="/client-dashboard" element={
          <ClientRoute>
            <ClientDashboard />
          </ClientRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
