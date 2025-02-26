
import { useState, useEffect } from 'react';
import { useVideoProcessing } from '@/hooks/useVideoProcessing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function VideoProcessingTest() {
  const [videoId, setVideoId] = useState('Spr3tKzkqnk'); // Default to the video ID you want to test
  const [result, setResult] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusPolling, setStatusPolling] = useState<NodeJS.Timeout | null>(null);
  const { processVideo, processing, error, getVideoStatus } = useVideoProcessing();

  const handleProcess = async () => {
    try {
      // Clear previous results and any previous polling
      setResult(null);
      if (statusPolling) clearInterval(statusPolling);
      
      // Validate videoId
      if (!videoId || videoId.trim() === '') {
        toast({
          variant: "destructive",
          title: "Invalid Video ID",
          description: "Please enter a valid YouTube video ID",
        });
        return;
      }
      
      // Start processing
      toast({
        title: "Processing Started",
        description: `Request to process video ${videoId} has been submitted`,
      });
      
      const response = await processVideo(videoId);
      setResult(response);
      
      // Set up polling to check the status
      startStatusPolling();
    } catch (err) {
      console.error('Failed to process video:', err);
      toast({
        variant: "destructive",
        title: "Processing Error",
        description: err instanceof Error ? err.message : 'An unknown error occurred',
      });
    }
  };

  const startStatusPolling = () => {
    // Poll for status updates every 3 seconds
    const interval = setInterval(fetchStatus, 3000);
    setStatusPolling(interval);
    
    // Stop polling after 2 minutes (to avoid indefinite polling)
    setTimeout(() => {
      if (statusPolling) {
        clearInterval(statusPolling);
        setStatusPolling(null);
      }
    }, 2 * 60 * 1000);
  };

  const fetchStatus = async () => {
    try {
      if (!videoId) return;
      
      const status = await getVideoStatus(videoId);
      
      // Update result with the latest status
      if (status) {
        setResult(prev => ({ ...prev, details: status }));
        
        // If processing is complete or failed, stop polling
        if (status.status === 'completed' || status.status === 'failed') {
          if (statusPolling) {
            clearInterval(statusPolling);
            setStatusPolling(null);
            
            // Show a toast notification for completion or failure
            if (status.status === 'completed') {
              toast({
                title: "Processing Complete",
                description: "The video has been successfully processed",
              });
            } else if (status.status === 'failed') {
              toast({
                variant: "destructive",
                title: "Processing Failed",
                description: status.error_message || "Failed to process video",
              });
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch status:', err);
    }
  };

  // Clean up interval on component unmount
  useEffect(() => {
    return () => {
      if (statusPolling) {
        clearInterval(statusPolling);
      }
    };
  }, [statusPolling]);

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
          <p className="text-xs text-muted-foreground">
            The ID is the part after "v=" in YouTube URLs, e.g., "Spr3tKzkqnk" from https://www.youtube.com/watch?v=Spr3tKzkqnk
          </p>
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
                {result.details?.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : result.details?.status === 'failed' ? (
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                )}
                <h3 className="font-bold">
                  {result.details?.status === 'completed'
                    ? 'Processing Successful'
                    : result.details?.status === 'failed'
                    ? 'Processing Failed'
                    : 'Processing...'}
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
            
            {result.details?.processing_metadata?.title && (
              <p className="mt-2 text-muted-foreground">
                <span className="font-medium">Title:</span> {result.details.processing_metadata.title}
              </p>
            )}
            
            {result.details?.transcript && (
              <p className="text-muted-foreground">
                <span className="font-medium">Transcript Length:</span> {result.details.transcript.length} characters
              </p>
            )}
            
            {result.details?.status && (
              <div className="mt-2 flex items-center">
                <span className="font-medium mr-2">Status:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${
                  result.details.status === 'completed' 
                    ? 'bg-green-100 text-green-800' 
                    : result.details.status === 'failed'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {result.details.status.charAt(0).toUpperCase() + result.details.status.slice(1)}
                </span>
              </div>
            )}
            
            {result.details?.error_message && (
              <p className="mt-2 text-red-600">
                <span className="font-medium">Error:</span> {result.details.error_message}
              </p>
            )}
            
            {showDetails && result.details && (
              <div className="mt-4 bg-muted p-4 rounded-md overflow-auto max-h-96">
                <h4 className="font-bold mb-2">Processing Details</h4>
                <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(result.details, null, 2)}</pre>
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
          <Button 
            variant="secondary" 
            onClick={fetchStatus}
            disabled={processing}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
