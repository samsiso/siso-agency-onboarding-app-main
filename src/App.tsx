
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
import Tools from '@/pages/Tools';
import SisoEducation from '@/pages/SisoEducation';
import AINews from '@/pages/AINews';
import CryptoExchange from '@/pages/CryptoExchange';
import HowToEarn from '@/pages/HowToEarn';
import Leaderboards from '@/pages/Leaderboards';
import Community from '@/pages/Community';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function App() {
  const { user, loading } = useAuthSession();

  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tools"
          element={
            <ProtectedRoute>
              <Tools />
            </ProtectedRoute>
          }
        />
        <Route
          path="/education"
          element={
            <ProtectedRoute>
              <SisoEducation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-news"
          element={
            <ProtectedRoute>
              <AINews />
            </ProtectedRoute>
          }
        />
        <Route
          path="/economy/crypto-exchange"
          element={
            <ProtectedRoute>
              <CryptoExchange />
            </ProtectedRoute>
          }
        />
        <Route
          path="/economy/earn"
          element={
            <ProtectedRoute>
              <HowToEarn />
            </ProtectedRoute>
          }
        />
        <Route
          path="/economy/leaderboards"
          element={
            <ProtectedRoute>
              <Leaderboards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/networking"
          element={
            <ProtectedRoute>
              <Community />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
