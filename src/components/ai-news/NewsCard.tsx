
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NewsCardMedia } from './NewsCardMedia';
import NewsCardContent from './NewsCardContent';
import { NewsItem } from '@/types/blog';

interface NewsCardProps {
  item: NewsItem;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  onAnalyzeArticle?: (id: string) => Promise<void>;
  isCompact?: boolean;
}

// [Analysis] Updated to correctly handle article source, AI analysis and other metadata
const NewsCard = ({ 
  item, 
  summaries, 
  loadingSummaries, 
  onGenerateSummary, 
  onAnalyzeArticle,
  isCompact = false 
}: NewsCardProps) => {
  const { toast } = useToast();
  
  const handleAnalyze = async (id: string) => {
    try {
      if (onAnalyzeArticle) {
        await onAnalyzeArticle(id);
        toast({
          title: "Analysis complete",
          description: "Article has been analyzed by AI",
        });
      } else {
        console.log("AI Analysis requested for article:", id);
        toast({
          title: "Analysis requested",
          description: "This feature is coming soon",
        });
      }
    } catch (error) {
      console.error('Error analyzing article:', error);
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: "Could not analyze this article",
      });
    }
  };
  
  return (
    <Card className="overflow-hidden bg-gray-900/30 border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-lg h-full flex flex-col">
      <div className="flex flex-col h-full">
        <div className={isCompact ? 'h-20' : 'h-44 md:h-52'}>
          <NewsCardMedia 
            imageUrl={item.image_url} 
            title={item.title} 
            source={item.source}
            featured={item.featured || false} 
            height={isCompact ? 'h-20' : 'h-44 md:h-52'}
          />
        </div>
        
        <div className="flex-1 p-4 flex flex-col">
          <NewsCardContent
            post={item}
            hideContent={isCompact}
            hideMetadata={false}
            truncateTitle={true}
            onAnalyze={handleAnalyze}
          />
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
