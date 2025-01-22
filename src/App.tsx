import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Tools from './pages/Tools';
import ToolPage from './pages/ToolPage';
import SisoEducation from './pages/SisoEducation';
import Networking from './pages/Networking';
import ChatGPTAssistants from './pages/ChatGPTAssistants';
import AINews from './pages/AINews';
import Automations from './pages/Automations';
import SisoAI from './pages/SisoAI';
import Profile from './pages/Profile';
import HowToEarn from './pages/HowToEarn';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/tools" element={<Tools />} />
      <Route path="/tools/:id" element={<ToolPage />} />
      <Route path="/siso-education" element={<SisoEducation />} />
      <Route path="/networking" element={<Networking />} />
      <Route path="/chat-gpt-assistants" element={<ChatGPTAssistants />} />
      <Route path="/ai-news" element={<AINews />} />
      <Route path="/automations" element={<Automations />} />
      <Route path="/siso-ai" element={<SisoAI />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/how-to-earn" element={<HowToEarn />} />
    </Routes>
  );
}

export default App;