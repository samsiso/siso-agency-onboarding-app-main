
import { supabase } from '@/integrations/supabase/client';
import type { EnhancedNewsItem, ContentCategory, TechnicalComplexity, ArticleImpact, ArticleSection } from '@/types/blog';

export const fetchBlogPost = async (id: string) => {
  const { data: articleData, error: articleError } = await supabase
    .from('ai_news')
    .select(`
      *,
      article_sections (
        id,
        title,
        content,
        order_index,
        section_order,
        technical_complexity,
        importance_level,
        subsection_type,
        source_references,
        created_at,
        updated_at,
        last_updated,
        article_id,
        overview,
        key_details,
        implications
      ),
      article_tags (
        id,
        tag,
        created_at
      ),
      news_comments (
        id,
        content,
        created_at,
        user_email,
        updated_at
      ),
      news_ai_analysis (
        id,
        key_insights,
        market_impact,
        tech_predictions,
        related_technologies,
        confidence_score,
        business_implications
      )
    `)
    .eq('id', id)
    .single();

  if (articleError) throw articleError;

  // [Analysis] Transform sections ensuring correct field mapping
  const transformedSections: ArticleSection[] = (articleData.article_sections || []).map((section: any) => ({
    id: section.id,
    title: section.title,
    content: section.content,
    order_index: section.order_index,
    section_order: section.section_order || section.order_index,
    technical_complexity: section.technical_complexity || 'intermediate',
    importance_level: section.importance_level || 'medium',
    subsection_type: section.subsection_type || 'overview',
    source_references: typeof section.source_references === 'object' 
      ? section.source_references 
      : {},
    created_at: section.created_at,
    updated_at: section.updated_at,
    last_updated: section.last_updated || section.updated_at,
    article_id: section.article_id || articleData.id,
    overview: section.overview,
    key_details: section.key_details || [],
    bullet_points: [], // Default empty array since it's not in DB
    implications: section.implications || [],
    related_topics: [], // Default empty array since it's not in DB
    key_figures: {}, // Default empty object since it's not in DB
    reading_time_minutes: 5, // Default value since it's not in DB
    category: articleData.category || 'general', // Using parent article's category
    is_featured: false, // Default value since it's not in DB
    metadata: {} // Default empty object since it's not in DB
  }));

  // [Analysis] Transform to EnhancedNewsItem with strongly typed sections
  const enhancedArticle: EnhancedNewsItem = {
    id: articleData.id,
    title: articleData.title,
    description: articleData.description,
    content: articleData.content,
    date: articleData.date,
    category: articleData.category as ContentCategory,
    technical_complexity: (articleData.technical_complexity || 'intermediate') as TechnicalComplexity,
    impact: (articleData.impact || 'medium') as ArticleImpact,
    sections: transformedSections,
    tags: articleData.article_tags || [],
    key_takeaways: Array.isArray(articleData.key_takeaways) 
      ? articleData.key_takeaways.map(item => String(item))
      : [],
    related_articles: Array.isArray(articleData.related_articles) 
      ? articleData.related_articles.map((article: any) => ({
          id: article.id || '',
          title: article.title || '',
          description: article.description || ''
        }))
      : [],
    table_of_contents: Array.isArray(articleData.table_of_contents)
      ? articleData.table_of_contents.map((item: any) => ({
          id: item.id || '',
          title: item.title || '',
          level: typeof item.level === 'number' ? item.level : 1
        }))
      : [],
    technical_details: typeof articleData.technical_details === 'object' 
      ? articleData.technical_details
      : {},
    source_credibility: articleData.source_credibility || 'verified',
    estimated_reading_time: articleData.estimated_reading_time || 5,
    views: articleData.views || 0,
    image_url: articleData.image_url,
    source: articleData.source,
    sources: Array.isArray(articleData.sources) ? articleData.sources.map(String) : [],
    ai_analysis: articleData.news_ai_analysis ? {
      key_insights: articleData.news_ai_analysis.key_insights || [],
      market_impact: articleData.news_ai_analysis.market_impact || '',
      tech_predictions: articleData.news_ai_analysis.tech_predictions || [],
      related_technologies: articleData.news_ai_analysis.related_technologies || [],
      confidence_score: articleData.news_ai_analysis.confidence_score || 0,
      business_implications: articleData.news_ai_analysis.business_implications || ''
    } : null
  };

  const comments = (articleData.news_comments || []).map(comment => ({
    ...comment,
    news_id: id
  }));

  return {
    ...enhancedArticle,
    comments
  };
};

