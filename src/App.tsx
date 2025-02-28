
import { Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import AINews from '@/pages/AINews';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import BlogPost from '@/pages/BlogPost';
import ChatGPTAssistants from '@/pages/ChatGPTAssistants';
import SisoEducation from '@/pages/SisoEducation';
import Tools from '@/pages/Tools';
import Economy from '@/pages/Economy';
import VideoDetail from '@/pages/VideoDetail';
import ToolPage from '@/pages/ToolPage';
import EducatorDetail from '@/pages/EducatorDetail';
import Community from '@/pages/Community';
import Networking from '@/pages/Networking';
import SisoAI from '@/pages/SisoAI';
import LearnNetwork from '@/pages/LearnNetwork';
import HowToEarn from '@/pages/HowToEarn';
import Leaderboards from '@/pages/Leaderboards';
import SocialOnboarding from '@/pages/onboarding/social';
import OnboardingCongratulations from '@/pages/onboarding/congratulations';
import ThankYou from '@/pages/ThankYou';
import Automations from '@/pages/Automations';
import Crypto from '@/pages/Crypto';
import CryptoExchange from '@/pages/CryptoExchange';
import DailyNews from '@/pages/DailyNews';
import Index from '@/pages/Index';
import Terms from '@/pages/Terms';
import PrivacyPolicy from '@/pages/PrivacyPolicy';

import { Toaster } from '@/components/ui/toaster';
import { useAuthSession } from '@/hooks/useAuthSession';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  const location = useLocation();
  const { user } = useAuthSession(); // [Analysis] Updated to use 'user' instead of 'session'

  // [Analysis] Log current route for debugging
  useEffect(() => {
    console.info('Current pathname:', location.pathname);
    console.info('Target route matching:', location.pathname.startsWith('/ai-news') ? '/ai-news' : 'other');
  }, [location]);

  return (
    <>
      <Helmet>
        <title>SISO - Your one-stop AI Knowledge source</title>
        <meta name="description" content="SISO is the premier platform for AI learning, resources, and community." />
      </Helmet>

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/ai-news" element={<AINews />} />
        <Route path="/ai-news/:postId" element={<BlogPost />} />
        <Route path="/daily-news" element={<DailyNews />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/thank-you" element={<ThankYou />} />

        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/assistants" element={
          <ProtectedRoute>
            <ChatGPTAssistants />
          </ProtectedRoute>
        } />
        <Route path="/education" element={
          <ProtectedRoute>
            <SisoEducation />
          </ProtectedRoute>
        } />
        <Route path="/education/video/:videoId" element={
          <ProtectedRoute>
            <VideoDetail />
          </ProtectedRoute>
        } />
        <Route path="/education/educator/:slug" element={
          <ProtectedRoute>
            <EducatorDetail />
          </ProtectedRoute>
        } />
        <Route path="/tools" element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        } />
        <Route path="/tools/:toolId" element={
          <ProtectedRoute>
            <ToolPage />
          </ProtectedRoute>
        } />
        <Route path="/economy" element={
          <ProtectedRoute>
            <Economy />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />
        <Route path="/networking" element={
          <ProtectedRoute>
            <Networking />
          </ProtectedRoute>
        } />
        <Route path="/siso" element={
          <ProtectedRoute>
            <SisoAI />
          </ProtectedRoute>
        } />
        <Route path="/learn-network" element={
          <ProtectedRoute>
            <LearnNetwork />
          </ProtectedRoute>
        } />
        <Route path="/economy/earn" element={
          <ProtectedRoute>
            <HowToEarn />
          </ProtectedRoute>
        } />
        <Route path="/economy/leaderboards" element={
          <ProtectedRoute>
            <Leaderboards />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/social" element={
          <ProtectedRoute>
            <SocialOnboarding />
          </ProtectedRoute>
        } />
        <Route path="/onboarding/congratulations" element={
          <ProtectedRoute>
            <OnboardingCongratulations />
          </ProtectedRoute>
        } />
        <Route path="/automations" element={
          <ProtectedRoute>
            <Automations />
          </ProtectedRoute>
        } />
        <Route path="/crypto" element={
          <ProtectedRoute>
            <Crypto />
          </ProtectedRoute>
        } />
        <Route path="/economy/crypto-exchange" element={
          <ProtectedRoute>
            <CryptoExchange />
          </ProtectedRoute>
        } />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/ai-news" replace />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
