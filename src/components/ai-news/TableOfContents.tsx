
import { NavLink } from "@/components/ui/nav-link";
import { cn } from "@/lib/utils";
import { NewsItem } from '@/types/blog';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface TableOfContentsProps {
  items: NewsItem[];
  activeId?: string;
}

export const TableOfContents = ({ items, activeId }: TableOfContentsProps) => {
  // [Analysis] Group items by date for better organization
  const groupedByDate = items.reduce((acc, item) => {
    const date = new Date(item.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, NewsItem[]>);

  return (
    <div className="bg-card/50 backdrop-blur-sm rounded-lg border p-4">
      <h3 className="text-lg font-medium mb-4">Daily Briefs</h3>
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, articles]) => (
          <div key={date} className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(date), 'MMMM d, yyyy')}</span>
            </div>
            <div className="space-y-1.5 ml-2 pl-3 border-l">
              {articles.map((article) => (
                <NavLink
                  key={article.id}
                  href={`#${article.id}`}
                  className={cn(
                    "text-sm py-1 hover:underline flex items-center gap-2 transition-colors",
                    activeId === article.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  <ArrowRight 
                    className={cn(
                      "h-3 w-0 transition-all duration-200", 
                      activeId === article.id && "w-3 text-primary"
                    )} 
                  />
                  <span className="line-clamp-1">{article.title}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
