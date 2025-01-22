import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Index from './pages/Index';
import AINews from './pages/AINews';
import Tools from './pages/Tools';
import ToolPage from './pages/ToolPage';
import SisoEducation from './pages/SisoEducation';
import Automations from './pages/Automations';
import Networking from './pages/Networking';
import ChatGPTAssistants from './pages/ChatGPTAssistants';
import Community from './pages/Community';
import SisoAI from './pages/SisoAI';
import Profile from './pages/Profile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import ThankYou from './pages/ThankYou';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/ai-news" element={<AINews />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tool/:id" element={<ToolPage />} />
        <Route path="/siso-education" element={<SisoEducation />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/networking" element={<Networking />} />
        <Route path="/chat-gpt-assistants" element={<ChatGPTAssistants />} />
        <Route path="/community" element={<Community />} />
        <Route path="/siso-ai" element={<SisoAI />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/thank-you" element={<ThankYou />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;
