
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { NewsItem } from '@/types/blog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DuplicatesCheckDialogProps {
  open: boolean;
  onClose: () => void;
  onRefresh: () => void;
  articles?: NewsItem[];
  loading: boolean;
  onImport: (skipDuplicates: boolean) => Promise<void>;
}

export const DuplicatesCheckDialog = ({
  open,
  onClose,
  onRefresh,
  articles = [],
  loading,
  onImport
}: DuplicatesCheckDialogProps) => {
  const [importing, setImporting] = useState(false);
  
  // Count duplicates
  const duplicates = articles.filter(a => a.isDuplicate).length;
  const uniqueArticles = articles.length - duplicates;
  
  const handleImport = async (skipDuplicates: boolean) => {
    try {
      setImporting(true);
      await onImport(skipDuplicates);
      onClose();
    } catch (error) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-blue-400" />
            Duplicate Check Results
          </DialogTitle>
          <DialogDescription>
            {duplicates > 0 ? (
              <span className="text-orange-400">
                Found {duplicates} potential duplicate articles out of {articles.length} total
              </span>
            ) : (
              <span className="text-green-400">
                All {articles.length} articles are unique
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-2 my-4">
          {loading ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-16 bg-gray-800/50 rounded-md" />
              ))}
            </div>
          ) : (
            articles.map((article, index) => (
              <div 
                key={`${article.id}-${index}`} 
                className={cn(
                  "p-3 border rounded-md",
                  article.isDuplicate 
                    ? "border-orange-800/30 bg-orange-950/5" 
                    : "border-green-800/30 bg-green-950/5"
                )}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {article.isDuplicate ? (
                      <AlertTriangle className="h-5 w-5 text-orange-500" />
                    ) : (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{article.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">{article.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {article.source}
                      </Badge>
                      
                      {article.url && (
                        <Badge variant="outline" className="text-xs bg-blue-950/20 text-blue-400 border-blue-800/30">
                          Has URL
                        </Badge>
                      )}
                      
                      {article.image_url && (
                        <Badge variant="outline" className="text-xs bg-purple-950/20 text-purple-400 border-purple-800/30">
                          Has Image
                        </Badge>
                      )}
                      
                      {article.isDuplicate && (
                        <Badge variant="outline" className="text-xs bg-orange-950/20 text-orange-400 border-orange-800/30">
                          Potential Duplicate
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {articles.length === 0 && !loading && (
            <div className="text-center py-8 border border-dashed border-gray-800 rounded-md">
              <p className="text-gray-500">No articles to check</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={onRefresh}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-gray-400">
            {uniqueArticles} unique articles found
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={importing}
            >
              Cancel
            </Button>
            
            {duplicates > 0 && (
              <Button
                variant="outline"
                className="gap-2 bg-orange-950/10 text-orange-400 hover:bg-orange-950/20 hover:text-orange-300"
                onClick={() => handleImport(false)}
                disabled={importing || articles.length === 0}
              >
                <AlertTriangle className="h-4 w-4" />
                Import All ({articles.length})
              </Button>
            )}
            
            <Button
              variant="default"
              className="gap-2"
              onClick={() => handleImport(true)}
              disabled={importing || articles.length === 0}
            >
              <Check className="h-4 w-4" />
              {duplicates > 0 ? `Import Unique (${uniqueArticles})` : `Import All (${articles.length})`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
