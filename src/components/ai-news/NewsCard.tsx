
import { memo } from 'react';
import { Card } from "@/components/ui/card";
import { NewsCardContent } from './NewsCardContent';
import { NewsCardMedia } from './NewsCardMedia';
import { format } from 'date-fns';
import { ArticleMetadata } from './ArticleMetadata';

interface NewsCardProps {
  item: any;
  summaries: Record<string, string>;
  loadingSummaries: Record<string, boolean>;
  onGenerateSummary: (id: string) => void;
  isCompact?: boolean;
  isFeatured?: boolean;
}

function NewsCard({ 
  item, 
  summaries, 
  loadingSummaries, 
  onGenerateSummary,
  isCompact = false,
  isFeatured = false 
}: NewsCardProps) {
  const formattedDate = format(new Date(item.date), 'MMMM d, yyyy');
  const isDailyBrief = item.template_type === 'daily_brief';

  // [Analysis] Handler to ensure correct function signature
  const handleGenerateSummary = () => {
    onGenerateSummary(item.id);
  };

  if (isDailyBrief) {
    return (
      <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-200">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold">
              {item.title}
            </h3>
            <span className="text-sm text-muted-foreground">
              {formattedDate}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            {item.description}
          </p>
          <ArticleMetadata
            date={item.date}
            source={item.source || 'Unknown'}
            impact={item.impact}
            views={item.views}
            bookmarks={item.bookmarks}
            readingTime={item.reading_time}
            sourceCredibility={item.source_credibility}
            technicalComplexity={item.technical_complexity}
            articleType={item.article_type}
            isCompact={true}
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col h-full group hover:shadow-md transition-shadow duration-200">
      <div className="flex flex-col h-full">
        <NewsCardMedia
          imageUrl={item.image_url}
          title={item.title}
          isFeatured={isFeatured}
          isCompact={isCompact}
        />
        <NewsCardContent
          title={item.title}
          description={item.description}
          date={item.date}
          source={item.source || 'Unknown'}
          impact={item.impact}
          summary={summaries[item.id]}
          loadingSummary={loadingSummaries[item.id]}
          onGenerateSummary={handleGenerateSummary}
          newsId={item.id}
          comments={item.comments}
          readingTime={item.reading_time}
          views={item.views}
          bookmarks={item.bookmarks}
          sourceCredibility={item.source_credibility}
          technicalComplexity={item.technical_complexity}
          articleType={item.article_type}
          isCompact={isCompact}
        />
      </div>
    </Card>
  );
}

export default memo(NewsCard);
