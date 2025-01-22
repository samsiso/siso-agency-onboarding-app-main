import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4">
      <h1 className="text-4xl font-bold text-siso-text mb-4">Page Not Found</h1>
      <p className="text-siso-text/80 mb-8">The page you're looking for doesn't exist.</p>
      <Button 
        onClick={() => navigate('/')}
        className="bg-gradient-to-r from-siso-orange to-siso-red hover:from-siso-orange/90 hover:to-siso-red/90"
      >
        Back to Home
      </Button>
    </div>
  );
};

export default NotFound;