import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Tools from './pages/Tools';
import Community from './pages/Community';
import Automations from './pages/Automations';
import ChatGPTAssistants from './pages/ChatGPTAssistants';
import SisoAI from './pages/SisoAI';
import SisoEducation from './pages/SisoEducation';
import Networking from './pages/Networking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/community" element={<Community />} />
        <Route path="/automations" element={<Automations />} />
        <Route path="/assistants" element={<ChatGPTAssistants />} />
        <Route path="/siso-ai" element={<SisoAI />} />
        <Route path="/education" element={<SisoEducation />} />
        <Route path="/networking" element={<Networking />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </Router>
  );
}

export default App;