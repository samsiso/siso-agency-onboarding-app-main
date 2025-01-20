import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Tools from './pages/Tools';
import ToolPage from './pages/ToolPage';
import Education from './pages/SisoEducation';
import Automations from './pages/Automations';
import ChatGPTAssistants from './pages/ChatGPTAssistants';
import SisoAI from './pages/SisoAI';
import Networking from './pages/Networking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import { ChatBot } from './components/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Index /><ChatBot agentType="general" /></>} />
        <Route path="/tools" element={<><Tools /><ChatBot agentType="tools" /></>} />
        <Route path="/tools/:slug" element={<><ToolPage /><ChatBot agentType="tools" /></>} />
        <Route path="/education" element={<><Education /><ChatBot agentType="education" /></>} />
        <Route path="/automations" element={<><Automations /><ChatBot agentType="automations" /></>} />
        <Route path="/assistants" element={<><ChatGPTAssistants /><ChatBot agentType="assistants" /></>} />
        <Route path="/siso-ai" element={<><SisoAI /><ChatBot agentType="ai" /></>} />
        <Route path="/networking" element={<><Networking /><ChatBot agentType="networking" /></>} />
        <Route path="/privacy-policy" element={<><PrivacyPolicy /><ChatBot agentType="general" /></>} />
        <Route path="/terms" element={<><Terms /><ChatBot agentType="general" /></>} />
      </Routes>
    </Router>
  );
}

export default App;