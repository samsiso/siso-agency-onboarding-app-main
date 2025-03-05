
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { LoaderCircle, BookmarkPlus, MessageSquare, Share2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface ArticleActionsProps {
  onReadArticle?: () => void;
  summary?: string;
  loadingSummary?: boolean;
  onGenerateSummary?: () => void;
  newsId?: string;
  comments?: any[];
  title?: string;
}

export const ArticleActions = ({
  onReadArticle,
  summary,
  loadingSummary = false,
  onGenerateSummary,
  newsId,
  comments = [],
  title = ""
}: ArticleActionsProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);

  // [Analysis] Handlers for article interaction with proper feedback
  const handleReadLater = () => {
    toast({
      title: "Saved for later",
      description: "Article has been bookmarked for later reading"
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: "Check out this AI news article",
          url: `/ai-news/${newsId}`,
        });
      } else {
        const url = `${window.location.origin}/ai-news/${newsId}`;
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied",
          description: "Article link copied to clipboard"
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleViewComments = () => {
    navigate(`/ai-news/${newsId}#comments`);
  };
  
  const handleCopySummary = async () => {
    if (!summary) return;
    setCopying(true);
    try {
      await navigator.clipboard.writeText(summary);
      toast({
        title: "Summary copied",
        description: "The article summary has been copied to your clipboard"
      });
    } catch (error) {
      console.error("Error copying summary:", error);
      toast({
        title: "Copy failed",
        description: "Could not copy the summary to clipboard",
        variant: "destructive"
      });
    } finally {
      setCopying(false);
    }
  };

  // [Analysis] Function to share to LinkedIn specifically
  const handleShareToLinkedIn = () => {
    if (!newsId) return;
    
    const url = encodeURIComponent(`${window.location.origin}/ai-news/${newsId}`);
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    window.open(linkedInUrl, '_blank', 'noopener,noreferrer');
    
    toast({
      title: "Sharing to LinkedIn",
      description: "Opening LinkedIn to share this article"
    });
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Summary section */}
      {(summary || loadingSummary || onGenerateSummary) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-muted-foreground">Quick Summary</h4>
            {summary && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleCopySummary}
                disabled={copying || loadingSummary}
              >
                {copying ? "Copying..." : "Copy"}
              </Button>
            )}
          </div>

          {loadingSummary ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : summary ? (
            <Textarea 
              readOnly 
              value={summary} 
              className="resize-none bg-muted/50 text-sm" 
              rows={3}
            />
          ) : onGenerateSummary && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onGenerateSummary} 
              className="w-full"
            >
              Generate Summary
            </Button>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onReadArticle} 
          className="flex-1"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Read Article
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleReadLater}
          className="flex-1 md:flex-none"
        >
          <BookmarkPlus className="h-4 w-4 mr-2" />
          Save
        </Button>
        
        {comments && comments.length > 0 && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewComments}
            className="flex-1 md:flex-none"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            {comments.length}
          </Button>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleShare}
          className="flex-1 md:flex-none"
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
};
