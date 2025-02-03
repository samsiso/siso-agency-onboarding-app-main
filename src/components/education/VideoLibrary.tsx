import { motion } from 'framer-motion';
import { ToolVideoGrid } from '../tools/ToolVideoGrid';
import { CommunityMember } from '../community/types';

interface VideoLibraryProps {
  members?: CommunityMember[];
  isLoading: boolean;
  selectedEducator?: string;
}

export const VideoLibrary = ({ members, isLoading, selectedEducator }: VideoLibraryProps) => {
  const videos = members?.flatMap(member => 
    member.youtube_videos?.map(video => ({
      ...video,
      educator: {
        name: member.name,
        avatar_url: member.profile_image_url
      },
      metrics: {
        views: Math.floor(Math.random() * 10000),
        likes: Math.floor(Math.random() * 1000),
        sentiment_score: Math.random(),
        difficulty: ['Beginner', 'Intermediate', 'Advanced'][
          Math.floor(Math.random() * 3)
        ],
        impact_score: Math.random() * 10
      },
      topics: member.content_themes || [],
      ai_analysis: {
        key_takeaways: ['Sample takeaway 1', 'Sample takeaway 2'],
        implementation_steps: ['Step 1', 'Step 2']
      }
    })) || []
  );

  const featuredVideos = members?.slice(0, 3).flatMap(member =>
    (member.youtube_videos || []).slice(0, 1).map(video => ({
      ...video,
      educator: {
        name: member.name,
        avatar_url: member.profile_image_url
      },
      metrics: {
        views: Math.floor(Math.random() * 50000),
        likes: Math.floor(Math.random() * 5000),
        sentiment_score: 0.8 + Math.random() * 0.2,
        difficulty: 'Intermediate',
        impact_score: 8 + Math.random() * 2
      },
      topics: member.content_themes || [],
      ai_analysis: {
        key_takeaways: ['Featured takeaway 1', 'Featured takeaway 2'],
        implementation_steps: ['Step 1', 'Step 2', 'Step 3']
      }
    }))
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <ToolVideoGrid
        videos={videos}
        featuredVideos={featuredVideos}
        isLoading={isLoading}
      />
    </motion.div>
  );
};