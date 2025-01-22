import { BrowserRouter as Router } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { SidebarProvider } from './components/ui/sidebar';
import { AuthButton } from './components/AuthButton';
import { Toaster } from './components/ui/toaster';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

const App = () => {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95">
          {/* Auth Button in top right */}
          <div className="fixed top-4 right-4 z-50">
            <AuthButton />
          </div>
          
          <Sidebar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </SidebarProvider>
    </Router>
  );
};

export default App;