
import { Card } from "@/components/ui/card";
import { NewsCardMedia } from './NewsCardMedia';
import { NewsCardContent } from './NewsCardContent';
import { NewsItem } from '@/types/blog';

interface NewsCardProps {
  item: NewsItem;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  isCompact?: boolean;
}

// [Analysis] Added debugging log to understand article IDs
const NewsCard = ({ item, summaries, loadingSummaries, onGenerateSummary, isCompact = false }: NewsCardProps) => {
  console.log('NewsCard rendering with ID:', item.id);
  
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
            title={item.title}
            description={item.description}
            date={item.date}
            source={item.source}
            impact={item.impact}
            isCompact={isCompact}
            summary={summaries[item.id]}
            loadingSummary={loadingSummaries[item.id]}
            onGenerateSummary={() => onGenerateSummary(item.id)}
            newsId={item.id} // [Analysis] This is critical - ensure we pass the ID
            readingTime={item.estimated_reading_time || item.reading_time}
            views={item.views}
            sourceCredibility={item.source_credibility}
            technicalComplexity={item.technical_complexity}
            articleType={item.article_type}
            url={item.url} // [Analysis] Pass URL for external articles
          />
        </div>
      </div>
    </Card>
  );
};

export default NewsCard;
