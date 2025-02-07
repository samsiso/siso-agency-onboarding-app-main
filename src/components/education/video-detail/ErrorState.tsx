
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ErrorState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-siso-bg to-siso-bg/95 p-4 md:p-8 flex flex-col items-center justify-center gap-4">
      <div className="text-xl text-siso-text">Video not found</div>
      <Button 
        variant="ghost" 
        onClick={() => navigate('/education')}
        className="flex items-center gap-2"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to Videos
      </Button>
    </div>
  );
};
