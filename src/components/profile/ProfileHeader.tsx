import { User, Trophy, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileHeaderProps {
  fullName: string | null;
  email: string | null;
  points: number;
  rank: string;
  onLogout: () => void;
  onBackToHome: () => void;
}

export const ProfileHeader = ({ 
  fullName, 
  email, 
  points, 
  rank, 
  onLogout, 
  onBackToHome 
}: ProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-siso-text/10 pb-6">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
          <User className="w-8 h-8 text-siso-red" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-siso-text-bold">
            {fullName || email?.split('@')[0]}
          </h1>
          <div className="flex items-center gap-2 text-siso-text/70">
            <Trophy className="w-4 h-4 text-siso-orange" />
            <span>{points || 0} points</span>
            <Star className="w-4 h-4 text-siso-orange ml-2" />
            <span>{rank || 'Newbie'}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <Button 
          variant="outline" 
          className="border-siso-red text-siso-text hover:bg-siso-red hover:text-white transition-colors"
          onClick={onLogout}
        >
          Logout
        </Button>
        <Button 
          variant="outline" 
          className="border-siso-text/20 text-siso-text-bold hover:bg-siso-text/10"
          onClick={onBackToHome}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
};