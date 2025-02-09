
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, MessageSquare, Sparkles } from 'lucide-react';
import { ShareDialog } from './dialogs/ShareDialog';
import { AIAnalysisDialog } from './AIAnalysisDialog';
import { NewsCardComments } from './NewsCardComments';
import { useState } from 'react';

interface ArticleActionsProps {
  onReadArticle: () => void;
  summary?: string;
  loadingSummary?: boolean;
  onGenerateSummary?: () => void;
  newsId?: string;
  comments?: any[];
  title: string;
}

export const ArticleActions = ({
  onReadArticle,
  summary,
  loadingSummary,
  onGenerateSummary,
  newsId,
  comments = [],
  title,
}: ArticleActionsProps) => {
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="ghost"
        size="sm"
        className="h-8 px-2 text-xs sm:text-sm text-siso-text/60 hover:text-siso-red hover:bg-siso-red/10 transition-colors"
        onClick={onReadArticle}
      >
        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        Read Article
      </Button>

      <Dialog open={aiAnalysisOpen} onOpenChange={setAiAnalysisOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
          >
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            AI Analysis
          </Button>
        </DialogTrigger>
      </Dialog>
      <AIAnalysisDialog 
        open={aiAnalysisOpen} 
        onOpenChange={setAiAnalysisOpen}
        newsId={newsId || ''}
      />

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={() => !summary && onGenerateSummary?.()}
            className="h-8 px-2 text-xs sm:text-sm hover:bg-siso-red/10 hover:text-siso-red transition-colors"
          >
            {loadingSummary ? "Generating..." : summary ? "View AI Summary" : "Generate AI Summary"}
          </Button>
        </DialogTrigger>
        <ShareDialog
          open={false}
          onOpenChange={() => {}}
          summary={summary || ''}
          title={title}
          loadingSummary={loadingSummary || false}
        />
      </Dialog>

      {newsId && comments && (
        <NewsCardComments newsId={newsId} comments={comments} />
      )}
    </div>
  );
};
