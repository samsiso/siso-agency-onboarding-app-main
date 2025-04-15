
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import OnboardingSocial from './pages/onboarding/social';
import { Toaster } from '@/components/ui/toaster';
import OnboardingChat from '@/pages/OnboardingChat';
import ThankYou from './pages/ThankYou';
import ThankYouPlan from './pages/ThankYouPlan';
import Plan from './pages/Plan';
import DecoraPlan from './pages/DecoraPlan';
import Congratulations from './pages/onboarding/congratulations';
import Home from './pages/Home';
import CryptoExchange from './pages/CryptoExchange';
import HowToEarn from './pages/HowToEarn';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import HelpPage from './pages/HelpPage';
import { AuthGuard } from './components/auth/AuthGuard';
import MyProjects from './pages/MyProjects';
import AdminPlans from './pages/AdminPlans';
import AdminTemplates from './pages/AdminTemplates';
import Portfolio from './pages/Portfolio';

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
        
        {/* Admin routes - we're keeping these unprotected for now */}
        <Route path="/admin/plans" element={<AdminPlans />} />
        <Route path="/admin/templates" element={<AdminTemplates />} />
        <Route path="/admin/plans/create" element={<AdminPlans />} />
        <Route path="/admin/plans/:planId/edit" element={<AdminPlans />} />
        
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
        <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
      </Routes>
    </>
  );
}

export default App;
