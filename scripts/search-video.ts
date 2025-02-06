
import { supabase } from '@/integrations/supabase/client';

// Search for Tech with Tim's Python Futures video
const searchVideo = async () => {
  const { data, error } = await supabase
    .from('youtube_videos')
    .select(`
      id,
      title,
      url,
      duration,
      date,
      channel_id,
      viewCount
    `)
    .ilike('title', '%python%future%')
    .eq('channel_id', 'UC4JX40jDee_tINbkjycV4Sg') // Tech With Tim's channel ID
    .limit(1);

  console.log('Search results:', data);
  console.log('Error if any:', error);
};

searchVideo();
