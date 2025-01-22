import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Routes, Route } from 'react-router-dom';
import { Home } from '@/pages/Home';
import { Profile } from '@/pages/Profile';
import { Tools } from '@/pages/Tools';
import { Automations } from '@/pages/Automations';
import { Education } from '@/pages/Education';
import { Networking } from '@/pages/Networking';
import { Assistants } from '@/pages/Assistants';
import { News } from '@/pages/News';
import { SisoAI } from '@/pages/SisoAI';
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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/automations" element={<Automations />} />
          <Route path="/education" element={<Education />} />
          <Route path="/networking" element={<Networking />} />
          <Route path="/assistants" element={<Assistants />} />
          <Route path="/news" element={<News />} />
          <Route path="/ai" element={<SisoAI />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;