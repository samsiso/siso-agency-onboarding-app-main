
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ProfileSection } from './ProfileSection';

interface SidebarFooterProps {
  collapsed: boolean;
}

export const SidebarFooter = ({ collapsed }: SidebarFooterProps) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
    }
  };

  return (
    <div className="absolute bottom-0 w-full p-4 border-t border-siso-text/10 space-y-3 bg-gradient-to-t from-siso-bg to-transparent">
      {user && (
        <ProfileSection
          userId={user.id}
          userEmail={user.email}
          fullName={profile?.full_name}
          avatarUrl={profile?.avatar_url}
          collapsed={collapsed}
        />
      )}
    </div>
  );
};
