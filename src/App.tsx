
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import OnboardingSocial from './pages/onboarding/social';
import { Toaster } from '@/components/ui/toaster';
import OnboardingChat from '@/pages/OnboardingChat';
import ThankYou from '@/pages/ThankYou';
import ThankYouPlan from '@/pages/ThankYouPlan';
import Plan from './pages/Plan';
import DecoraPlan from './pages/DecoraPlan';
import Congratulations from './pages/onboarding/congratulations';
import Home from './pages/Home';
import CryptoExchange from './pages/CryptoExchange';
import HowToEarn from './pages/HowToEarn';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/onboarding-chat" element={<OnboardingChat />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/thankyou-plan" element={<ThankYouPlan />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/onboarding/social" element={<OnboardingSocial />} />
        <Route path="/onboarding/congratulations" element={<Congratulations />} />
        <Route path="/plan/:username" element={<Plan />} />
        <Route path="/decora-plan" element={<DecoraPlan />} />
        
        {/* Protected Dashboard Routes */}
        <Route 
          path="/home" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Project Routes */}
        <Route 
          path="/plan-builder" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/my-projects" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/portfolio" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Financial Routes */}
        <Route 
          path="/payments" 
          element={
            <ProtectedRoute>
              <CryptoExchange />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/economy/earn" 
          element={
            <ProtectedRoute>
              <HowToEarn />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/economy/leaderboards" 
          element={
            <ProtectedRoute>
              <HowToEarn />
            </ProtectedRoute>
          } 
        />
        
        {/* Protected Support & Settings Routes */}
        <Route 
          path="/help" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </>
  );
}

export default App;
