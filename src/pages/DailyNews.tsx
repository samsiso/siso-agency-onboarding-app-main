
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Helmet } from 'react-helmet';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { format, parse, addDays, subDays } from 'date-fns';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNewsItems } from '@/hooks/useNewsItems';

const DailyNews = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const [isValidDate, setIsValidDate] = useState(true);
  const [formattedDate, setFormattedDate] = useState('');
  
  const {
    newsItems,
    summaries,
    loadingSummaries,
    generateSummary,
    loading,
    error
  } = useNewsItems(null, 'published', date);
  
  useEffect(() => {
    try {
      if (!date) {
        navigate(`/ai-news/daily/${format(new Date(), 'yyyy-MM-dd')}`);
        return;
      }
      
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date());
      setFormattedDate(format(parsedDate, 'MMMM d, yyyy'));
      setIsValidDate(true);
    } catch (error) {
      console.error('Invalid date format', error);
      setIsValidDate(false);
    }
  }, [date, navigate]);

  const navigateDay = (direction: 'prev' | 'next') => {
    try {
      const parsedDate = parse(date!, 'yyyy-MM-dd', new Date());
      const newDate = direction === 'prev' 
        ? subDays(parsedDate, 1)
        : addDays(parsedDate, 1);
      
      navigate(`/ai-news/daily/${format(newDate, 'yyyy-MM-dd')}`);
    } catch (error) {
      console.error('Error navigating date', error);
    }
  };
  
  // [Analysis] Organize news items by category for better reading experience
  const organizedContent = newsItems.reduce((groups: Record<string, any[]>, item) => {
    const category = item.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
  
  return (
    <div className="flex min-h-screen bg-siso-bg">
      <Helmet>
        <title>{isValidDate ? `AI News - ${formattedDate}` : 'Daily AI News'}</title>
        <meta name="description" content={`Daily AI news briefing for ${formattedDate}`} />
      </Helmet>
      
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/ai-news')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI News
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Daily AI Briefing
            </h1>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDay('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="px-4 py-2 bg-card border rounded-md">
                <span className="font-medium">{formattedDate}</span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDay('next')}
                disabled={format(new Date(), 'yyyy-MM-dd') === date}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        
        {!isValidDate && (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">Invalid date format</h2>
            <p className="text-muted-foreground mb-4">
              Please use the format YYYY-MM-DD
            </p>
            <Button
              onClick={() => navigate(`/ai-news/daily/${format(new Date(), 'yyyy-MM-dd')}`)}
            >
              Go to Today's Briefing
            </Button>
          </div>
        )}
        
        {isValidDate && loading && (
          <div className="space-y-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-10 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Skeleton className="h-64" />
                  <Skeleton className="h-64" />
                </div>
              </div>
            ))}
          </div>
        )}
        
        {isValidDate && !loading && Object.keys(organizedContent).length === 0 && (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <h2 className="text-xl font-semibold mb-2">No news available for this date</h2>
            <p className="text-muted-foreground mb-4">
              Try selecting a different date or check back later
            </p>
          </div>
        )}
        
        {isValidDate && !loading && Object.keys(organizedContent).length > 0 && (
          <div className="space-y-12">
            {Object.entries(organizedContent).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">
                  {category}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {items.map(item => (
                    <div 
                      key={item.id}
                      className="bg-card border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-2 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {item.source} • {format(new Date(item.date), 'MMM d')}
                          </span>
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => navigate(`/ai-news/${item.id}`)}
                          >
                            Read more
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DailyNews;
