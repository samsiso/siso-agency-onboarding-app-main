import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Database } from '@/integrations/supabase/types';
import { useQuery } from '@tanstack/react-query';

type PointActionType = Database['public']['Enums']['point_action_type'];

export const usePoints = (userId: string | undefined) => {
  console.log('usePoints hook called with userId:', userId);
  const { toast } = useToast();

  const { data: pointsData, isLoading, error } = useQuery({
    queryKey: ['points', userId],
    queryFn: async () => {
      console.log('Fetching points data for userId:', userId);
      if (!userId) throw new Error('No user ID provided');
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('points, rank')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching points:', error);
        throw error;
      }

      console.log('Points data fetched:', profile);
      return profile;
    },
    enabled: !!userId,
  });

  const points = pointsData?.points || 0;
  const rank = pointsData?.rank || 'Newbie';

  useEffect(() => {
    if (!userId) return;
    console.log('Setting up realtime subscription for points');

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
          console.log('Realtime points update received:', payload);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up points subscription');
      supabase.removeChannel(channel);
    };
  }, [userId]);

  const awardPoints = async (action: PointActionType) => {
    console.log('Awarding points for action:', action);
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