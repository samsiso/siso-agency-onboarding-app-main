
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ChevronLeft, Calendar } from 'lucide-react';

// [Analysis] Define proper types for our article data
interface Article {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  date: string;
  category: string;
  impact: string;
  technical_complexity: string;
  reading_time: number;
  key_takeaways: string[];
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_news')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Article; // Cast the response to our Article type
    },
  });

  const navigateToDailyView = () => {
    if (article?.date) {
      navigate(`/ai-news/daily/${article.date}`);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-gray-900 to-black">
        <Sidebar />
        <div className="flex-1 p-8">
          {/* Navigation Header */}
          <div className="flex items-center justify-between mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/ai-news')}
              className="text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to News
            </Button>
            
            <Button
              variant="outline"
              onClick={navigateToDailyView}
              className="text-white gap-2"
            >
              <Calendar className="h-4 w-4" />
              View Daily News for {article?.date && format(new Date(article.date), 'MMMM d, yyyy')}
            </Button>
          </div>

          {/* Article Content */}
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-white/10 rounded w-3/4"></div>
              <div className="h-4 bg-white/10 rounded w-1/2"></div>
              <div className="h-64 bg-white/10 rounded"></div>
            </div>
          ) : article ? (
            <div className="space-y-6 max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-white">{article.title}</h1>
              <div className="flex items-center gap-4 text-gray-400">
                <span>{format(new Date(article.date), 'MMMM d, yyyy')}</span>
                <span>•</span>
                <span>{article.category}</span>
              </div>
              {article.image_url && (
                <img 
                  src={article.image_url} 
                  alt={article.title}
                  className="w-full rounded-lg object-cover h-64"
                />
              )}
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {article.description}
              </p>
              
              {/* Enhanced Content Section */}
              <div className="mt-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Impact Level</h3>
                    <p className="text-gray-300">{article.impact}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Technical Complexity</h3>
                    <p className="text-gray-300">{article.technical_complexity}</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-white mb-2">Reading Time</h3>
                    <p className="text-gray-300">{article.reading_time} minutes</p>
                  </div>
                </div>
                
                {Array.isArray(article.key_takeaways) && article.key_takeaways.length > 0 && (
                  <div className="bg-white/5 p-6 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Key Takeaways</h3>
                    <ul className="space-y-3">
                      {article.key_takeaways.map((takeaway, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-300">
                          <span className="bg-white/10 px-2 py-1 rounded-full text-sm">
                            {index + 1}
                          </span>
                          {takeaway}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-400">Article not found</div>
          )}
        </div>
      </div>
    </SidebarProvider>
  );
};

export default BlogPost;
