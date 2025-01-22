import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Profile from './pages/Profile';
import Tools from './pages/Tools';
import ToolPage from './pages/ToolPage';
import SisoAI from './pages/SisoAI';
import Community from './pages/Community';
import AINews from './pages/AINews';
import SisoEducation from './pages/SisoEducation';
import Automations from './pages/Automations';
import ChatGPTAssistants from './pages/ChatGPTAssistants';
import Networking from './pages/Networking';
import Crypto from './pages/Crypto';
import HowToEarn from './pages/HowToEarn';
import Terms from './pages/Terms';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ThankYou from './pages/ThankYou';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tool/:id" element={<ToolPage />} />
      <Route path="/siso-ai" element={<SisoAI />} />
      <Route path="/community" element={<Community />} />
      <Route path="/ai-news" element={<AINews />} />
      <Route path="/education" element={<SisoEducation />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="/assistants" element={<ChatGPTAssistants />} />
      <Route path="/networking" element={<Networking />} />
      <Route path="/crypto" element={<Crypto />} />
      <Route path="/how-to-earn" element={<HowToEarn />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/thank-you" element={<ThankYou />} />
    </Routes>
  );
}

export default App;