import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy load all pages
const Index = lazy(() => import('./pages/Index'));
const Tools = lazy(() => import('./pages/Tools'));
const ToolPage = lazy(() => import('./pages/ToolPage'));
const SisoEducation = lazy(() => import('./pages/SisoEducation'));
const Networking = lazy(() => import('./pages/Networking'));
const ChatGPTAssistants = lazy(() => import('./pages/ChatGPTAssistants'));
const AINews = lazy(() => import('./pages/AINews'));
const Automations = lazy(() => import('./pages/Automations'));
const SisoAI = lazy(() => import('./pages/SisoAI'));
const Profile = lazy(() => import('./pages/Profile'));
const HowToEarn = lazy(() => import('./pages/HowToEarn'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-siso-bg">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="w-8 h-8 text-siso-red animate-spin" />
      <p className="text-siso-text">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
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
    </Suspense>
  );
}

export default App;