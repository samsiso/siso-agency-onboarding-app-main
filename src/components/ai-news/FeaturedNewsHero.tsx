
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Award, Bot, BookmarkPlus, MessageSquare, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { NewsItem } from "@/types/blog";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ArticleMetadata } from "./ArticleMetadata";

interface FeaturedNewsHeroProps {
  article: NewsItem;
  onGenerateSummary: (id: string) => void;
  summary: string;
  loadingSummary: boolean;
}

const FeaturedNewsHero = ({
  article,
  onGenerateSummary,
  summary,
  loadingSummary
}: FeaturedNewsHeroProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [copying, setCopying] = useState(false);

  // [Analysis] Handle article navigation
  const handleReadArticle = () => {
    navigate(`/ai-news/${article.id}`);
  };

  // [Analysis] Handle summary generation
  const handleGenerateSummary = () => {
    if (!summary && !loadingSummary) {
      onGenerateSummary(article.id);
      toast({
        title: "Generating summary",
        description: "Please wait while we generate a summary for this article"
      });
    }
  };

  // [Analysis] Handle summary copying
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

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card shadow-md transition-all duration-200 hover:shadow-lg">
      <div className="absolute top-4 left-4 z-10">
        <Badge className="gap-1 bg-primary/80 backdrop-blur-sm text-primary-foreground">
          <Award className="h-3 w-3" />
          Featured
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 min-h-[400px]">
        {/* Image */}
        <div className="relative overflow-hidden col-span-1 md:col-span-1 lg:col-span-1 h-full min-h-[250px]">
          <img
            src={article.image_url || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent md:bg-gradient-to-b"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 col-span-1 md:col-span-1 lg:col-span-2 p-6 flex flex-col bg-gradient-to-b from-background/95 to-background">
          <div className="mb-4">
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight tracking-tight hover:text-primary transition-colors duration-200">
                {article.title}
              </h1>

              <ArticleMetadata
                date={article.date}
                source={article.source}
                impact={article.impact}
                views={article.views}
                bookmarks={article.bookmarks}
                readingTime={article.reading_time}
                sourceCredibility={article.source_credibility}
                technicalComplexity={article.technical_complexity}
                articleType={article.article_type}
              />
            </div>

            <p className="mt-4 text-base sm:text-lg text-muted-foreground line-clamp-3">
              {article.description}
            </p>
          </div>

          {/* Summary section */}
          <div className="mt-auto space-y-3">
            {(summary || loadingSummary) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Bot className="h-4 w-4 text-primary" />
                    AI Summary
                  </h4>
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
                    className={cn(
                      "resize-none bg-muted/50 text-sm",
                      "focus:ring-1 focus:ring-primary/30 border-muted"
                    )}
                    rows={3}
                  />
                ) : null}
              </div>
            )}

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="default"
                onClick={handleReadArticle}
                className="flex items-center gap-2 w-full"
              >
                Read Article
                <ArrowRight className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {!summary && !loadingSummary && (
                  <Button
                    variant="outline"
                    onClick={handleGenerateSummary}
                    className="flex-1"
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    Summarize
                  </Button>
                )}

                <Button variant="outline" size="icon">
                  <BookmarkPlus className="h-4 w-4" />
                  <span className="sr-only">Save</span>
                </Button>

                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedNewsHero;
