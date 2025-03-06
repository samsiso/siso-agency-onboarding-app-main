
import React from 'react';
import { X, Loader2, FileText, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

// [Analysis] Component to display AI-generated summary of news articles on demand
interface AISummaryPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  isLoading: boolean;
  summary: {
    summary: string;
    keyPoints?: string[];
    applications?: string[];
    sentiment?: string;
  } | null;
  onGenerate: () => void;
}

const AISummaryPopup: React.FC<AISummaryPopupProps> = ({
  isOpen,
  onClose,
  title,
  content,
  isLoading,
  summary,
  onGenerate
}) => {
  const { toast } = useToast();

  // [Analysis] Don't render anything if the popup isn't open
  if (!isOpen) return null;

  const handleCopyToClipboard = () => {
    if (!summary) return;
    
    const textToCopy = `Summary of "${title}":\n\n${summary.summary}\n\n${
      summary.keyPoints ? `Key Points:\n${summary.keyPoints.map(point => `- ${point}`).join('\n')}\n\n` : ''
    }${
      summary.applications ? `Applications:\n${summary.applications.map(app => `- ${app}`).join('\n')}` : ''
    }`;
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The summary has been copied to your clipboard",
      });
    });
  };

  // [Analysis] Get sentiment color for the badge
  const getSentimentColor = (sentiment?: string) => {
    if (!sentiment) return "bg-gray-600";
    
    switch (sentiment.toLowerCase()) {
      case 'positive': return "bg-green-600";
      case 'negative': return "bg-red-600";
      case 'neutral': return "bg-blue-600";
      default: return "bg-purple-600";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border shadow-xl">
        <CardHeader className="relative border-b border-border">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CardTitle className="pr-8 text-lg sm:text-xl">
            AI Summary
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {title}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 pb-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Generating AI summary...</p>
            </div>
          ) : !summary ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  No summary has been generated yet. Click the button below to generate one.
                </p>
                <Button onClick={onGenerate} className="mx-auto">
                  Generate Summary
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {summary.sentiment && (
                <div className="flex justify-end">
                  <Badge className={`${getSentimentColor(summary.sentiment)}`}>
                    {summary.sentiment} Sentiment
                  </Badge>
                </div>
              )}
              
              <div>
                <h3 className="text-lg font-medium mb-2">Summary</h3>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {summary.summary}
                </p>
              </div>
              
              {summary.keyPoints && summary.keyPoints.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Key Points</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {summary.applications && summary.applications.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Applications</h3>
                  <div className="space-y-2">
                    {summary.applications.map((application, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <Lightbulb className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <p className="text-sm">{application}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        
        {summary && (
          <CardFooter className="border-t border-border pt-4 flex justify-between">
            <Button variant="outline" size="sm" onClick={handleCopyToClipboard}>
              Copy to clipboard
            </Button>
            
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default AISummaryPopup;
