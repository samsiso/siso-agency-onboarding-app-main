import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Profile from '@/pages/Profile';
import Tools from '@/pages/Tools';
import Automations from '@/pages/Automations';
import SisoEducation from '@/pages/SisoEducation';
import Networking from '@/pages/Networking';
import ChatGPTAssistants from '@/pages/ChatGPTAssistants';
import AINews from '@/pages/AINews';
import SisoAI from '@/pages/SisoAI';
import ToolPage from '@/pages/ToolPage';
import Community from '@/pages/Community';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import ThankYou from '@/pages/ThankYou';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex min-h-screen">
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/:id" element={<ToolPage />} />
              <Route path="/siso-education" element={<SisoEducation />} />
              <Route path="/automations" element={<Automations />} />
              <Route path="/networking" element={<Networking />} />
              <Route path="/chat-gpt-assistants" element={<ChatGPTAssistants />} />
              <Route path="/community" element={<Community />} />
              <Route path="/ai-news" element={<AINews />} />
              <Route path="/siso-ai" element={<SisoAI />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/thank-you" element={<ThankYou />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;