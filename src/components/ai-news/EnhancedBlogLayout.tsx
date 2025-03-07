
import React, { useState, useEffect } from 'react';
import { EnhancedNewsItem, NewsComment, ArticleSection } from '@/types/blog';
import { HeroImage } from './blog-layout/HeroImage';
import { ReadingProgressBar } from './blog-layout/ReadingProgressBar';
import { BackToTopButton } from './blog-layout/BackToTopButton';
import { toast } from 'react-hot-toast';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { ArticleTableOfContents } from './blog-layout/ArticleTableOfContents';
import { BlogHeader } from './blog-layout/components/BlogHeader';
import { QuickActionsBar } from './blog-layout/components/QuickActionsBar';
import { BlogContent } from './blog-layout/components/BlogContent';
import { SidebarActions } from './blog-layout/components/SidebarActions';

// [Analysis] Main blog layout component that orchestrates all the pieces
interface EnhancedBlogLayoutProps {
  article: EnhancedNewsItem & { comments?: NewsComment[] };
  onShare?: () => void;
  onBookmark?: () => void;
  onAnalyze?: () => Promise<void>;
}

export const EnhancedBlogLayout = ({
  article,
  onShare,
  onBookmark,
  onAnalyze
}: EnhancedBlogLayoutProps) => {
  const supabase = useSupabaseClient();
  const [activeSection, setActiveSection] = useState<string>();
  const [liked, setLiked] = useState(false);
  const [isGeneratingAnalysis, setIsGeneratingAnalysis] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(article);
  
  // [Analysis] Update current article when prop changes
  useEffect(() => {
    setCurrentArticle(article);
  }, [article]);
  
  // [Analysis] Track which section is currently visible
  useEffect(() => {
    // Get all sections including special ones
    const sections = [
      'key-takeaways', 
      ...article.sections.map(section => section.id),
      'ai-analysis-section',
      'community-notes'
    ];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: '-100px 0px -100px 0px' }
    );

    // Observe all content sections
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [article.sections, currentArticle.ai_analysis]);

  // [Analysis] Handle external link navigation
  const handleExternalLink = () => {
    if (article.url) {
      window.open(article.url, '_blank', 'noopener,noreferrer');
    }
  };
  
  const handleLike = () => {
    setLiked(!liked);
  };

  // [Analysis] Generate content for active section title
  const getActiveSectionTitle = () => {
    if (!activeSection) return undefined;
    
    if (activeSection === 'key-takeaways') return 'Key Takeaways';
    if (activeSection === 'ai-analysis-section') return 'AI Analysis';
    if (activeSection === 'community-notes') return 'Community Notes';
    
    // Find in sections array
    const section = article.sections.find(s => s.id === activeSection);
    return section?.title;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      {/* Reading Progress Indicator */}
      <ReadingProgressBar />
      
      {/* Back to Top Button */}
      <BackToTopButton />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blog Header */}
        <BlogHeader 
          article={article}
          handleExternalLink={handleExternalLink}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Enhanced Hero Image */}
            <HeroImage article={article} />
            
            {/* Quick Actions Bar */}
            <QuickActionsBar 
              activeSection={activeSection}
              sectionTitle={getActiveSectionTitle()}
              liked={liked}
              handleLike={handleLike}
              onBookmark={onBookmark}
              onShare={onShare}
            />
            
            {/* Main Blog Content */}
            <BlogContent 
              article={currentArticle}
              onAnalyze={onAnalyze}
            />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-6">
              {/* Enhanced Article Table of Contents */}
              <ArticleTableOfContents 
                article={article}
                activeSection={activeSection}
                onRefreshAnalysis={onAnalyze}
              />
              
              {/* Sharing and bookmarking */}
              <SidebarActions 
                onShare={onShare}
                onBookmark={onBookmark}
                handleExternalLink={handleExternalLink}
                hasExternalUrl={!!article.url}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
