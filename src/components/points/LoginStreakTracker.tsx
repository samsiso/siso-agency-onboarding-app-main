import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Flame } from 'lucide-react';

export const LoginStreakTracker = ({ userId }: { userId: string }) => {
  const { toast } = useToast();

  useEffect(() => {
    const updateLoginStreak = async () => {
      try {
        const { data: existingStreak, error: streakError } = await supabase
          .from('login_streaks')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (streakError) throw streakError;

        const now = new Date();
        const lastLogin = existingStreak?.last_login ? new Date(existingStreak.last_login) : null;
        const isNewDay = !lastLogin || 
          (now.getDate() !== lastLogin.getDate() || 
           now.getMonth() !== lastLogin.getMonth() || 
           now.getFullYear() !== lastLogin.getFullYear());

        if (isNewDay) {
          const isConsecutiveDay = lastLogin && 
            (now.getTime() - lastLogin.getTime()) < (36 * 60 * 60 * 1000); // 36 hours to allow for timezone differences

          if (!existingStreak) {
            // First login ever
            const { error: insertError } = await supabase
              .from('login_streaks')
              .insert([{ user_id: userId }]);

            if (insertError) throw insertError;

            // Award points for first login
            const { error: pointsError } = await supabase
              .from('points_log')
              .insert([
                {
                  user_id: userId,
                  action: 'daily_login',
                  points_earned: 5
                }
              ]);

            if (pointsError) throw pointsError;

            toast({
              title: "Welcome!",
              description: "You earned 5 points for your first login!",
            });
          } else if (isConsecutiveDay) {
            // Consecutive day login
            const newStreak = existingStreak.current_streak + 1;
            const newLongestStreak = Math.max(newStreak, existingStreak.longest_streak);
            
            const { error: updateError } = await supabase
              .from('login_streaks')
              .update({ 
                current_streak: newStreak,
                longest_streak: newLongestStreak,
                last_login: now.toISOString()  // Convert Date to ISO string
              })
              .eq('user_id', userId);

            if (updateError) throw updateError;

            // Award daily login points
            const { error: pointsError } = await supabase
              .from('points_log')
              .insert([
                {
                  user_id: userId,
                  action: 'daily_login',
                  points_earned: 5
                }
              ]);

            if (pointsError) throw pointsError;

            // Check for 7-day streak bonus
            if (newStreak % 7 === 0) {
              const { error: streakBonusError } = await supabase
                .from('points_log')
                .insert([
                  {
                    user_id: userId,
                    action: 'login_streak',
                    points_earned: 50
                  }
                ]);

              if (streakBonusError) throw streakBonusError;

              toast({
                title: "Streak Bonus!",
                description: "You earned 50 points for maintaining a 7-day login streak!",
              });
            } else {
              toast({
                title: "Daily Login!",
                description: `You earned 5 points! Current streak: ${newStreak} days`,
              });
            }
          } else {
            // Streak broken
            const { error: updateError } = await supabase
              .from('login_streaks')
              .update({ 
                current_streak: 1,
                last_login: now.toISOString()  // Convert Date to ISO string
              })
              .eq('user_id', userId);

            if (updateError) throw updateError;

            // Still award daily login points
            const { error: pointsError } = await supabase
              .from('points_log')
              .insert([
                {
                  user_id: userId,
                  action: 'daily_login',
                  points_earned: 5
                }
              ]);

            if (pointsError) throw pointsError;

            toast({
              title: "Welcome Back!",
              description: "You earned 5 points for logging in today!",
            });
          }
        }
      } catch (error: any) {
        console.error('Error updating login streak:', error);
        toast({
          variant: "destructive",
          title: "Error updating streak",
          description: error.message,
        });
      }
    };

    if (userId) {
      updateLoginStreak();
    }
  }, [userId]);

  return null;
};