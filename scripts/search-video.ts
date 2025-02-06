
import { supabase } from '@/integrations/supabase/client';

// Search for Tech with Tim's videos
const searchVideo = async () => {
  // First let's verify we have the correct channel ID by getting creator info
  const { data: creator } = await supabase
    .from('education_creators')
    .select('name, channel_id')
    .eq('channel_id', 'UC4JX40jDee_tINbkjycV4Sg')
    .single();

  console.log('Creator info:', creator);

  // Now let's get all videos from this channel
  const { data: videos, error } = await supabase
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
    .eq('channel_id', 'UC4JX40jDee_tINbkjycV4Sg')
    .order('date', { ascending: false });

  console.log('Found videos:', videos?.length || 0);
  console.log('All video titles:');
  videos?.forEach(video => {
    console.log(`[${video.date}] ${video.title} (${video.id})`);
    console.log(`URL: ${video.url}`);
    console.log('---');
  });

  if (error) {
    console.error('Error:', error);
  }
};

searchVideo();
