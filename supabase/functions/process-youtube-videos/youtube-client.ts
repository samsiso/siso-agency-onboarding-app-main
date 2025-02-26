
// YouTube API client for edge functions

/**
 * Creates a YouTube API client with the given API key
 */
export function createYouTubeClient(apiKey: string) {
  const BASE_URL = "https://www.googleapis.com/youtube/v3";
  
  return {
    /**
     * Get video details from YouTube API
     */
    getVideoDetails: async (videoId: string) => {
      const url = `${BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      if (!data.items || data.items.length === 0) {
        throw new Error(`Video not found: ${videoId}`);
      }
      
      return data.items[0];
    },
    
    /**
     * Get transcript for a video using 3rd party service
     * This is a fallback since YouTube API doesn't provide transcripts directly
     */
    getTranscript: async (videoId: string) => {
      try {
        // Try to get transcript from YouTube transcript API
        const url = `https://youtubetranscript.com/?server_vid=${videoId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Transcript service error: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.transcripts || data.transcripts.length === 0) {
          throw new Error("No transcript available");
        }
        
        // Combine transcript segments
        const fullTranscript = data.transcripts
          .map((item: any) => item.text)
          .join(" ");
          
        return fullTranscript;
      } catch (error) {
        console.error(`Failed to get transcript for ${videoId}:`, error);
        throw error;
      }
    },
    
    /**
     * List videos from a channel
     */
    listChannelVideos: async (channelId: string, pageToken?: string) => {
      const url = `${BASE_URL}/search?part=snippet&channelId=${channelId}&maxResults=50&order=date&type=video${pageToken ? `&pageToken=${pageToken}` : ''}&key=${apiKey}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`YouTube API error: ${response.status} - ${errorText}`);
      }
      
      return response.json();
    }
  };
}
