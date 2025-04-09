
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DecoraPlan = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately navigate to the plan page without any animation or delay
    console.log("DecoraPlan: Immediately redirecting to /plan/decora");
    navigate('/plan/decora', { replace: true });
  }, [navigate]);
  
  // Return a loading indicator or null, but always return something consistent
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white">Redirecting to your plan...</p>
    </div>
  );
};

export default DecoraPlan;
