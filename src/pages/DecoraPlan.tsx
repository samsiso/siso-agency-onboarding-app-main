
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DecoraPlan = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately navigate to the plan page without any animation or delay
    console.log("DecoraPlan: Immediately redirecting to /plan/decora");
    navigate('/plan/decora', { replace: true });
  }, [navigate]);
  
  // Return null as this component will immediately redirect
  return null;
};

export default DecoraPlan;
