
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LandingPage from '@/components/landing/LandingPage';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if the user is already logged in and redirect to home if they are
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        navigate('/home', { replace: true });
      }
    };
    
    checkAuth();
  }, [navigate]);

  return <LandingPage />;
};

export default Index;
