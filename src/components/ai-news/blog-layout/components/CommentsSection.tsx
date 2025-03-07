
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { NewsComment } from '@/types/blog';
import { NewsCardComments } from '../../NewsCardComments';

// [Analysis] This component renders the comments section
interface CommentsSectionProps {
  newsId: string;
  comments: NewsComment[];
}

export const CommentsSection = ({ newsId, comments }: CommentsSectionProps) => {
  return (
    <div id="community-notes" className="mt-12 bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-blue-400" />
        Community Notes ({comments ? (Array.isArray(comments) ? comments.length : 0) : 0})
      </h3>
      <NewsCardComments 
        newsId={newsId}
        comments={comments || []}
      />
    </div>
  );
};
