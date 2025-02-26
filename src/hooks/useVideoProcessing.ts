
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
        .maybeSingle();

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

  // Retry a failed video processing
  const retryProcessing = async (recordId: string) => {
    try {
      setProcessing(true);
      setError(null);
      
      // Get the video record to extract the video_id
      const { data: record, error: fetchError } = await supabase
        .from('ai_news_video_processing')
        .select('video_id')
        .eq('id', recordId)
        .single();
      
      if (fetchError || !record) {
        throw new Error(fetchError?.message || 'Record not found');
      }
      
      // Invoke processing with the video_id
      return await processVideo(record.video_id);
    } catch (err) {
      console.error('Error retrying processing:', err);
      setError(err as Error);
      throw err;
    } finally {
      setProcessing(false);
    }
  };

  // Delete a processing record
  const deleteProcessingRecord = async (recordId: string) => {
    try {
      setError(null);
      
      const { error: deleteError } = await supabase
        .from('ai_news_video_processing')
        .delete()
        .eq('id', recordId);
      
      if (deleteError) {
        throw deleteError;
      }
      
      return true;
    } catch (err) {
      console.error('Error deleting record:', err);
      setError(err as Error);
      
      toast({
        variant: "destructive",
        title: "Delete Failed",
        description: err instanceof Error ? err.message : 'Failed to delete processing record',
      });
      
      return false;
    }
  };

  return {
    processing,
    error,
    processVideo,
    getPendingVideos,
    getVideoStatus,
    retryProcessing,
    deleteProcessingRecord
  };
};
