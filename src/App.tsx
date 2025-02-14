
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Tools from '@/pages/Tools';
import ToolPage from '@/pages/ToolPage';
import AINews from '@/pages/AINews';
import BlogPost from '@/pages/BlogPost';
import SisoAI from '@/pages/SisoAI';
import ChatGPTAssistants from '@/pages/ChatGPTAssistants';
import Automations from '@/pages/Automations';
import Networking from '@/pages/Networking';
import Community from '@/pages/Community';
import LearnNetwork from '@/pages/LearnNetwork';
import HowToEarn from '@/pages/HowToEarn';
import Economy from '@/pages/Economy';
import CryptoExchange from '@/pages/CryptoExchange';
import Crypto from '@/pages/Crypto';
import Leaderboards from '@/pages/Leaderboards';
import SisoEducation from '@/pages/SisoEducation';
import EducatorDetail from '@/pages/EducatorDetail';
import VideoDetail from '@/pages/VideoDetail';
import Terms from '@/pages/Terms';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import ThankYou from '@/pages/ThankYou';
import SocialOnboarding from '@/pages/onboarding/social';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  const { user, loading } = useAuthSession();

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/welcome" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* Protected routes that require authentication */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/tools" element={
          <ProtectedRoute>
            <Tools />
          </ProtectedRoute>
        } />
        <Route path="/tools/:id" element={
          <ProtectedRoute>
            <ToolPage />
          </ProtectedRoute>
        } />
        <Route path="/ai-news" element={
          <ProtectedRoute>
            <AINews />
          </ProtectedRoute>
        } />
        <Route path="/ai-news/:id" element={
          <ProtectedRoute>
            <BlogPost />
          </ProtectedRoute>
        } />
        <Route path="/assistants" element={
          <ProtectedRoute>
            <ChatGPTAssistants />
          </ProtectedRoute>
        } />
        <Route path="/automations" element={
          <ProtectedRoute>
            <Automations />
          </ProtectedRoute>
        } />
        <Route path="/networking" element={
          <ProtectedRoute>
            <Networking />
          </ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />
        <Route path="/learn" element={
          <ProtectedRoute>
            <LearnNetwork />
          </ProtectedRoute>
        } />
        <Route path="/economy/earn" element={
          <ProtectedRoute>
            <HowToEarn />
          </ProtectedRoute>
        } />
        <Route path="/earn" element={
          <ProtectedRoute>
            <HowToEarn />
          </ProtectedRoute>
        } />
        <Route path="/economy" element={
          <ProtectedRoute>
            <Economy />
          </ProtectedRoute>
        } />
        <Route path="/economy/crypto-exchange" element={
          <ProtectedRoute>
            <CryptoExchange />
          </ProtectedRoute>
        } />
        <Route path="/exchange" element={
          <ProtectedRoute>
            <CryptoExchange />
          </ProtectedRoute>
        } />
        <Route path="/crypto" element={
          <ProtectedRoute>
            <Crypto />
          </ProtectedRoute>
        } />
        <Route path="/economy/leaderboards" element={
          <ProtectedRoute>
            <Leaderboards />
          </ProtectedRoute>
        } />
        <Route path="/leaderboards" element={
          <ProtectedRoute>
            <Leaderboards />
          </ProtectedRoute>
        } />
        <Route path="/education/*" element={
          <ProtectedRoute>
            <SisoEducation />
          </ProtectedRoute>
        } />
        <Route path="/education/educators/:slug" element={
          <ProtectedRoute>
            <EducatorDetail />
          </ProtectedRoute>
        } />
        <Route path="/education/video/:id" element={
          <ProtectedRoute>
            <VideoDetail />
          </ProtectedRoute>
        } />

        {/* Onboarding routes (protected but allow partial auth) */}
        <Route path="/onboarding/social" element={
          <ProtectedRoute>
            <SocialOnboarding />
          </ProtectedRoute>
        } />
        <Route path="/thank-you" element={
          <ProtectedRoute>
            <ThankYou />
          </ProtectedRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
