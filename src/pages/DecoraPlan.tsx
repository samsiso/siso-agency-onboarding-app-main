
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageLoading } from '@/components/ui/message-loading';

const DecoraPlan = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Automatically redirect to the pre-populated Decora plan
    navigate('/plan/decora');
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-siso-bg to-black p-4">
      <div className="text-center">
        <MessageLoading className="mx-auto mb-4" />
        <p className="text-siso-text">Redirecting to plan...</p>
      </div>
    </div>
  );
};

export default DecoraPlan;
