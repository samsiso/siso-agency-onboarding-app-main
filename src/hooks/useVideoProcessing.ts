
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Created a dedicated hook for video processing operations
// [Plan] This can be expanded with more functionality as needed

export const useVideoProcessing = () => {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Trigger manual processing of a video
  const processVideo = async (videoId: string) => {
    try {
      setProcessing(true);
      setError(null);
      
      console.log(`Triggering manual processing for video: ${videoId}`);
      
      const { data, error: invokeError } = await supabase.functions.invoke('manual-process-videos', {
        body: { videoId },
      });

      if (invokeError) {
        throw invokeError;
      }

      console.log('Processing response:', data);
      
      if (!data.success) {
        throw new Error(data.error || 'Processing failed');
      }

      toast({
        title: "Processing Completed",
        description: `Successfully processed video: ${data.title || videoId}`,
      });
      
      return data;
    } catch (err) {
      console.error('Error processing video:', err);
      setError(err as Error);
      
      toast({
        variant: "destructive",
        title: "Processing Failed",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
      
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  // Get pending videos that need processing
  const getPendingVideos = async () => {
    try {
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('ai_news_video_processing')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      return data || [];
    } catch (err) {
      console.error('Error fetching pending videos:', err);
      setError(err as Error);
      
      toast({
        variant: "destructive",
        title: "Fetch Failed",
        description: 'Failed to fetch pending videos',
      });
      
      return [];
    }
  };

  // Get the processing status of a video
  const getVideoStatus = async (videoId: string) => {
    try {
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('ai_news_video_processing')
        .select('*')
        .eq('video_id', videoId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return data;
    } catch (err) {
      console.error('Error fetching video status:', err);
      setError(err as Error);
      return null;
    }
  };

  return {
    processing,
    error,
    processVideo,
    getPendingVideos,
    getVideoStatus
  };
};
