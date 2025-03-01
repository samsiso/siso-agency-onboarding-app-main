
import { Card } from "@/components/ui/card";
import { NewsCardMedia } from "./NewsCardMedia";
import { NewsCardContent } from "./NewsCardContent";
import { motion } from "framer-motion";
import { NewsItem } from "@/types/blog";

interface NewsCardProps {
  item: NewsItem;
  summaries?: Record<string, string>;
  loadingSummaries?: Record<string, boolean>;
  onGenerateSummary?: (id: string) => void;
  onBookmark?: (id: string) => void;
  onShare?: (title: string, description: string) => void;
  isCompact?: boolean;
}

const NewsCard = ({
  item,
  summaries = {},
  loadingSummaries = {},
  onGenerateSummary,
  onBookmark,
  onShare,
  isCompact = false
}: NewsCardProps) => {
  const handleReadArticle = () => {
    if (onBookmark) {
      onBookmark(item.id);
    }
  };

  const handleGenerateSummary = () => {
    if (onGenerateSummary) {
      onGenerateSummary(item.id);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="flex flex-col h-full overflow-hidden bg-card border-siso-border hover:border-siso-border-hover transition-colors">
        <div className="grid grid-cols-1 h-full">
          <NewsCardMedia 
            imageUrl={item.image_url}
            title={item.title}
            isCompact={isCompact}
          />
          <div className="p-4 md:p-5 flex-1 flex flex-col">
            <NewsCardContent
              title={item.title}
              description={item.description}
              date={item.date}
              source={item.source}
              impact={item.impact}
              onReadArticle={handleReadArticle}
              isCompact={isCompact}
              summary={summaries[item.id]}
              loadingSummary={loadingSummaries[item.id]}
              onGenerateSummary={handleGenerateSummary ? () => handleGenerateSummary() : undefined}
              newsId={item.id}
              comments={[]} // Will be populated in detail view
              readingTime={item.reading_time || item.estimated_reading_time}
              views={item.views}
              bookmarks={item.bookmarks}
              sourceCredibility={item.source_credibility}
              technicalComplexity={item.technical_complexity}
              articleType={item.article_type}
              url={item.url} // Pass the URL to NewsCardContent
            />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default NewsCard;
