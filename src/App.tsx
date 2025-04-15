
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import { Toaster } from '@/components/ui/toaster';
import Home from './pages/Home';
import LeaderboardPage from './pages/LeaderboardPage';
import SettingsPage from './pages/SettingsPage';
import { AuthGuard } from './components/auth/AuthGuard';
import Portfolio from './pages/Portfolio';
import AdminPlans from './pages/AdminPlans';
import AdminTemplates from './pages/AdminTemplates';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <>
      <Toaster />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        
        {/* Admin routes - protected with AuthGuard */}
        <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />
        <Route path="/admin/plans" element={<AuthGuard><AdminPlans /></AuthGuard>} />
        <Route path="/admin/templates" element={<AuthGuard><AdminTemplates /></AuthGuard>} />
        <Route path="/admin/plans/create" element={<AuthGuard><AdminPlans /></AuthGuard>} />
        <Route path="/admin/plans/:planId/edit" element={<AuthGuard><AdminPlans /></AuthGuard>} />
        
        {/* Protected routes */}
        <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
        <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
        <Route path="/portfolio" element={<AuthGuard><Portfolio /></AuthGuard>} />
        <Route path="/economy/leaderboards" element={<AuthGuard><LeaderboardPage /></AuthGuard>} />
      </Routes>
    </>
  );
}

export default App;
