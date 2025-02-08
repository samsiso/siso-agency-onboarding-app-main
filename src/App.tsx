
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Auth from '@/pages/Auth';
import Profile from '@/pages/Profile';
import Tools from '@/pages/Tools';
import ToolPage from '@/pages/ToolPage';
import AINews from '@/pages/AINews';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/welcome" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/:id" element={<ToolPage />} />
      <Route path="/ai-news" element={<AINews />} />
      <Route path="/siso-ai" element={<SisoAI />} />
      <Route path="/assistants" element={<ChatGPTAssistants />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="/networking" element={<Networking />} />
      <Route path="/community" element={<Community />} />
      <Route path="/learn" element={<LearnNetwork />} />
      <Route path="/economy/earn" element={<HowToEarn />} />
      <Route path="/earn" element={<HowToEarn />} />
      <Route path="/economy" element={<Economy />} />
      <Route path="/economy/crypto-exchange" element={<CryptoExchange />} />
      <Route path="/exchange" element={<CryptoExchange />} />
      <Route path="/crypto" element={<Crypto />} />
      <Route path="/economy/leaderboards" element={<Leaderboards />} />
      <Route path="/leaderboards" element={<Leaderboards />} />
      <Route path="/education" element={<SisoEducation />} />
      <Route path="/education/educators/:slug" element={<EducatorDetail />} />
      <Route path="/education/video/:id" element={<VideoDetail />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/thank-you" element={<ThankYou />} />
      <Route path="/onboarding/social" element={<SocialOnboarding />} />
    </Routes>
  );
}

export default App;
