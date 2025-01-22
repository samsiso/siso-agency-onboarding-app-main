import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface AuthButtonProps {
  collapsed?: boolean;
}

export const AuthButton = ({ collapsed }: AuthButtonProps) => {
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Error signing out');
    } else {
      toast.success('Signed out successfully');
      navigate('/');
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleSignIn}
      className="w-full gap-2 p-2.5 rounded-lg bg-gradient-to-r from-siso-red/10 to-siso-orange/10 
        hover:from-siso-red/20 hover:to-siso-orange/20 border border-siso-text/10 hover:border-siso-text/20 
        transition-all duration-300"
    >
      <LogIn className="w-5 h-5 text-siso-red transition-colors duration-300" />
      {!collapsed && (
        <span className="text-sm font-medium bg-gradient-to-r from-siso-red to-siso-orange bg-clip-text text-transparent">
          Sign In
        </span>
      )}
    </Button>
  );
};