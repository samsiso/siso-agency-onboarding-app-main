import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';

type PointActionType = Database['public']['Enums']['point_action_type'];

export const usePoints = (userId: string | undefined) => {
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState('Newbie');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const fetchPoints = async () => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('points, rank')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (profile) {
          setPoints(profile.points || 0);
          setRank(profile.rank || 'Newbie');
        }
      } catch (error: any) {
        console.error('Error fetching points:', error);
        toast({
          variant: "destructive",
          title: "Error fetching points",
          description: error.message,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoints();

    // Subscribe to realtime points updates
    const channel = supabase
      .channel('points-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload: any) => {
          if (payload.new) {
            setPoints(payload.new.points || 0);
            setRank(payload.new.rank || 'Newbie');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const awardPoints = async (action: PointActionType) => {
    if (!userId) return;

    try {
      const { data: config, error: configError } = await supabase
        .from('point_configurations')
        .select('points')
        .eq('action', action)
        .single();

      if (configError) throw configError;

      if (config) {
        const { error: logError } = await supabase
          .from('points_log')
          .insert([
            {
              user_id: userId,
              action: action,
              points_earned: config.points
            }
          ]);

        if (logError) throw logError;

        toast({
          title: "Points awarded!",
          description: `You earned ${config.points} points for ${action.replace(/_/g, ' ')}!`,
        });
      }
    } catch (error: any) {
      console.error('Error awarding points:', error);
      toast({
        variant: "destructive",
        title: "Error awarding points",
        description: error.message,
      });
    }
  };

  return { points, rank, isLoading, awardPoints };
};