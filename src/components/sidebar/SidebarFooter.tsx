import { useNavigate } from 'react-router-dom';
import { Bot, UserRound, Trophy, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const SidebarFooter = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(data);
      }
    };

    getProfile();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      getProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <div className="p-4">
      <button
        onClick={() => navigate('/profile')}
        className="w-full p-4 rounded-xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 
          hover:from-siso-red/20 hover:to-siso-orange/20 border border-siso-text/10 
          hover:border-siso-text/20 transition-all duration-300"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-siso-red/20 to-siso-orange/20 
              flex items-center justify-center">
              <UserRound className="w-8 h-8 text-siso-text-bold" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-siso-bg-alt 
              border border-siso-border flex items-center justify-center">
              <Bot className="w-3.5 h-3.5 text-siso-orange" />
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium text-siso-text-bold">
              {profile?.full_name || user.email?.split('@')[0]}
            </p>
            <div className="flex items-center justify-center gap-2 mt-1 text-xs text-siso-text/70">
              <Trophy className="w-3.5 h-3.5 text-siso-orange" />
              <span>{profile?.points || 0} points</span>
              <Star className="w-3.5 h-3.5 text-siso-orange ml-1" />
              <span>{profile?.rank || 'Newbie'}</span>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
};