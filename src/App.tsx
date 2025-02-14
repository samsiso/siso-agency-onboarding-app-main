import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthSession } from '@/hooks/useAuthSession';
import { Toaster } from '@/components/ui/toaster';
import Index from '@/pages/Index';
import Home from '@/pages/Home';
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
