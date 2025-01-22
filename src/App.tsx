import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load all pages
const Index = lazy(() => import('./pages/Index'));
const Tools = lazy(() => import('./pages/Tools'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const Education = lazy(() => import('./pages/SisoEducation'));
const Automations = lazy(() => import('./pages/Automations'));
const ChatGPTAssistants = lazy(() => import('./pages/ChatGPTAssistants'));
const SisoAI = lazy(() => import('./pages/SisoAI'));
const Networking = lazy(() => import('./pages/Networking'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/Terms'));
const AINews = lazy(() => import('./pages/AINews'));
const { ChatBot } = await import('./components/ChatBot');

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-siso-red" />
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<><Index /><ChatBot agentType="general" /></>} />
          <Route path="/tools" element={<><Tools /><ChatBot agentType="tools" /></>} />
          <Route path="/tools/:slug" element={<><ToolPage /><ChatBot agentType="tools" /></>} />
          <Route path="/education" element={<><Education /><ChatBot agentType="education" /></>} />
          <Route path="/automations" element={<><Automations /><ChatBot agentType="automations" /></>} />
          <Route path="/assistants" element={<><ChatGPTAssistants /><ChatBot agentType="assistants" /></>} />
          <Route path="/siso-ai" element={<><SisoAI /><ChatBot agentType="ai" /></>} />
          <Route path="/networking" element={<><Networking /><ChatBot agentType="networking" /></>} />
          <Route path="/ai-news" element={<><AINews /><ChatBot agentType="news" /></>} />
          <Route path="/privacy-policy" element={<><PrivacyPolicy /><ChatBot agentType="general" /></>} />
          <Route path="/terms" element={<><Terms /><ChatBot agentType="general" /></>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;