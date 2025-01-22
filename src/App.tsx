import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// Lazy load all pages with chunk names for better code splitting
const Index = lazy(() => import(/* webpackChunkName: "index" */ './pages/Index'));
const Tools = lazy(() => import(/* webpackChunkName: "tools" */ './pages/Tools'));
const ToolPage = lazy(() => import(/* webpackChunkName: "tool-page" */ './pages/ToolPage'));
const SisoEducation = lazy(() => import(/* webpackChunkName: "siso-education" */ './pages/SisoEducation'));
const Networking = lazy(() => import(/* webpackChunkName: "networking" */ './pages/Networking'));
const ChatGPTAssistants = lazy(() => import(/* webpackChunkName: "chat-gpt" */ './pages/ChatGPTAssistants'));
const AINews = lazy(() => import(/* webpackChunkName: "ai-news" */ './pages/AINews'));
const Automations = lazy(() => import(/* webpackChunkName: "automations" */ './pages/Automations'));
const SisoAI = lazy(() => import(/* webpackChunkName: "siso-ai" */ './pages/SisoAI'));
const Profile = lazy(() => import(/* webpackChunkName: "profile" */ './pages/Profile'));
const HowToEarn = lazy(() => import(/* webpackChunkName: "how-to-earn" */ './pages/HowToEarn'));

// Optimized loading fallback with better UX
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
        {/* Catch all route for 404s */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;