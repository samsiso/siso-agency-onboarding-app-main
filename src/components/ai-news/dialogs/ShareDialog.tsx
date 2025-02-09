
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShareButtons } from '../ShareButtons';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  summary: string;
  title: string;
  loadingSummary: boolean;
}

export const ShareDialog = ({ 
  open, 
  onOpenChange, 
  summary, 
  title,
  loadingSummary 
}: ShareDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>AI Summary & Share Options</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 sm:space-y-6 py-4">
        {summary ? (
          <div className="bg-card p-3 sm:p-4 rounded-lg border border-siso-red/20">
            <p className="text-sm sm:text-base">{summary}</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            {loadingSummary ? "Generating summary..." : "Click the button to generate a summary"}
          </div>
        )}
        
        <ShareButtons summary={summary || ''} title={title} />
      </div>
    </DialogContent>
  );
};
