import { useState } from 'react';
import { useNewsItems } from '@/hooks/useNewsItems';
import { Helmet } from 'react-helmet';
import { Sidebar } from '@/components/Sidebar';

const DailyNews = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { 
    newsItems, 
    summaries, 
    loadingSummaries, 
    generateSummary, 
    loading, 
    hasMore, 
    loadMore, 
    error,
    refresh
  } = useNewsItems(selectedCategory, 'published');

  const featuredArticle = newsItems.find(item => item.featured) || newsItems[0];

  return (
    <div className="flex min-h-screen bg-siso-bg">
      <Helmet>
        <title>Daily AI News | Your One-Stop AI Knowledge Source</title>
        <meta name="description" content="Stay updated with the latest news in artificial intelligence, machine learning, and AI tools." />
      </Helmet>
      
      <Sidebar />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20">
        <h1>Daily News</h1>
      </main>
    </div>
  );
};

export default DailyNews;
