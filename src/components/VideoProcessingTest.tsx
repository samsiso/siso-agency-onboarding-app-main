
import { useState } from 'react';
import { useVideoProcessing } from '@/hooks/useVideoProcessing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function VideoProcessingTest() {
  const [videoId, setVideoId] = useState('Spr3tKzkqnk'); // Default to the video ID you want to test
  const [result, setResult] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { processVideo, processing, error } = useVideoProcessing();

  const handleProcess = async () => {
    try {
      const response = await processVideo(videoId);
      setResult(response);
      
      // Fetch the detailed status after processing
      setTimeout(fetchStatus, 1000);
    } catch (err) {
      console.error('Failed to process video:', err);
    }
  };

  const fetchStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_news_video_processing')
        .select('*')
        .eq('video_id', videoId)
        .single();
        
      if (error) throw error;
      setResult(prev => ({ ...prev, details: data }));
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>YouTube Video Processing Test</CardTitle>
        <CardDescription>
          Process a YouTube video to extract details and transcript
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="videoId" className="text-sm font-medium">
            YouTube Video ID
          </label>
          <div className="flex space-x-2">
            <Input
              id="videoId"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              placeholder="Enter YouTube video ID"
              className="flex-1"
            />
            <Button
              onClick={handleProcess}
              disabled={processing || !videoId}
              className="min-w-[120px]"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                'Process Video'
              )}
            </Button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-destructive/20 rounded-md flex items-start space-x-2 text-destructive">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold">Error</h4>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        )}

        {result && !error && (
          <div className="p-4 bg-card border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {result.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                )}
                <h3 className="font-bold">
                  {result.success ? 'Processing Successful' : 'Processing Failed'}
                </h3>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </Button>
            </div>
            
            {result.title && (
              <p className="mt-2 text-muted-foreground">
                <span className="font-medium">Title:</span> {result.title}
              </p>
            )}
            
            {result.transcriptLength && (
              <p className="text-muted-foreground">
                <span className="font-medium">Transcript Length:</span> {result.transcriptLength} characters
              </p>
            )}
            
            {showDetails && result.details && (
              <div className="mt-4 bg-muted p-4 rounded-md overflow-auto max-h-96">
                <h4 className="font-bold mb-2">Processing Details</h4>
                <pre className="text-xs">{JSON.stringify(result.details, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => window.open(`https://youtube.com/watch?v=${videoId}`, '_blank')}>
          Open YouTube Video
        </Button>
        
        {result && (
          <Button variant="secondary" onClick={fetchStatus}>
            Refresh Status
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
