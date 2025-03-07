
import { motion } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { complexityColors } from './constants';
import { cn } from '@/lib/utils';

interface Section {
  id: string;
  title: string;
  content?: string;
  order_index: number;
  section_order: number;
  importance_level?: string;
  technical_complexity?: string;
  subsection_type?: string;
  source_references?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
  article_id?: string;
}

interface EventCardProps {
  section: Section;
  index: number;
}

// [Analysis] Enhanced content card with better typography and readability
export const EventCard = ({ section, index }: EventCardProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // [Analysis] Parse any code blocks in the content for syntax highlighting
  const renderContent = (content: string) => {
    if (!content) return null;
    
    // Replace code blocks with styled versions
    return content.split(/```([a-zA-Z]*)\n([\s\S]*?)```/).map((part, idx) => {
      if (idx % 3 === 0) {
        // Regular text between code blocks, preserve line breaks
        return part.split('\n').map((line, lineIdx) => (
          <p key={`text-${idx}-${lineIdx}`} className="mb-4 leading-relaxed">
            {line}
          </p>
        ));
      } else if (idx % 3 === 1) {
        // This is the language identifier, we'll skip it
        return null;
      } else {
        // This is a code block
        const language = content.split(/```([a-zA-Z]*)\n/)[idx - 1] || '';
        return (
          <div key={`code-${idx}`} className="my-6 rounded-lg overflow-hidden">
            {language && (
              <div className="bg-gray-800 px-4 py-1 text-xs text-gray-400 border-b border-gray-700">
                {language}
              </div>
            )}
            <pre className="bg-gray-900 p-4 overflow-x-auto text-sm text-gray-300 whitespace-pre">
              <code>{part}</code>
            </pre>
          </div>
        );
      }
    });
  };

  const getImportanceColor = (importance?: string) => {
    switch (importance?.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/30';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    }
  };

  const getComplexityColor = (complexity?: string) => {
    if (!complexity) return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    return complexityColors[complexity as keyof typeof complexityColors] || '';
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      id={section.id}
      className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div 
        className="p-5 border-b border-white/10 flex justify-between items-center cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex items-center gap-3">
          <div className="bg-blue-900/30 p-2 rounded-full">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white">{section.title}</h2>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {section.importance_level && (
                <Badge variant="outline" className={getImportanceColor(section.importance_level)}>
                  {section.importance_level} priority
                </Badge>
              )}
              
              {section.technical_complexity && (
                <Badge variant="outline" className={getComplexityColor(section.technical_complexity)}>
                  {section.technical_complexity} complexity
                </Badge>
              )}
              
              {section.subsection_type && (
                <Badge variant="outline" className="bg-gray-500/10 text-gray-400 border-gray-500/30">
                  {section.subsection_type}
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        <button 
          className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand();
          }}
        >
          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </button>
      </div>
      
      {isExpanded && section.content && (
        <div className={cn(
          "p-5 text-gray-200 prose prose-invert max-w-none prose-headings:text-blue-300",
          "prose-blockquote:border-blue-700 prose-blockquote:bg-blue-900/20 prose-blockquote:p-4 prose-blockquote:rounded-lg",
          "prose-li:marker:text-blue-400"
        )}>
          {renderContent(section.content)}
          
          {Object.keys(section.source_references || {}).length > 0 && (
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-sm font-medium text-gray-400 mb-2">Sources:</h4>
              <ul className="text-sm text-gray-500 space-y-1">
                {Object.entries(section.source_references || {}).map(([key, value]) => (
                  <li key={key} className="flex items-start gap-2">
                    <span className="text-blue-400">{key}:</span>
                    <span>{String(value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
