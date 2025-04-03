
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LandingPage from '@/components/landing/LandingPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>SISO - Your one-stop AI Knowledge source</title>
        <meta name="description" content="SISO is the premier platform for AI learning, resources, and community." />
      </Helmet>

      <Routes>
        <Route path="*" element={<LandingPage />} />
      </Routes>

      <Toaster />
    </>
  );
}

export default App;
