
import { FileQuestion, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNewsItems } from "@/hooks/useNewsItems";

export const NewsEmptyState = () => {
  const { toast } = useToast();
  const { syncNews, refresh } = useNewsItems(null);

  // [Analysis] Handlers to allow users to refresh content or sync new content
  const handleRefresh = () => {
    refresh();
    toast({
      title: "Refreshed",
      description: "Content has been refreshed",
    });
  };

  const handleSyncNews = async () => {
    try {
      toast({
        title: "Syncing news",
        description: "Fetching fresh content from sources...",
      });
      
      await syncNews();
    } catch (error) {
      console.error("Error syncing news:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center max-w-md mx-auto space-y-6">
      <div className="bg-muted/40 p-6 rounded-full">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">No articles found</h3>
        <p className="text-muted-foreground">
          We couldn't find any articles matching your current filters. Try adjusting your search criteria or check back later.
        </p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          onClick={handleRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
        
        <Button 
          onClick={handleSyncNews}
          className="gap-2"
        >
          <Search className="h-4 w-4" />
          Sync New Articles
        </Button>
      </div>
    </div>
  );
};
