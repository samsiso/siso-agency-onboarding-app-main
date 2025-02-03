import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { GraduationCap, Search, Grid, List, TrendingUp, Star, Clock, Filter, SlidersHorizontal } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';
import { AnimatePresence, motion } from 'framer-motion';
import { EducationNav } from '@/components/education/EducationNav';
import { VideoLibrary } from '@/components/education/VideoLibrary';
import { EducatorsDirectory } from '@/components/education/EducatorsDirectory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

const popularCategories = ['AI & ML', 'Web Development', 'Data Science', 'Business', 'Design'];

export default function SisoEducation() {
  const [activeSection, setActiveSection] = useState<'videos' | 'educators'>('videos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: members, isLoading } = useQuery({
    queryKey: ['education-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education_creators')
        .select('*');
      
      if (error) throw error;
      
      return data.map(member => ({
        id: member.id,
        name: member.name,
        description: member.channel_description,
        member_type: member.member_type || 'Creator',
        youtube_url: member.youtube_url,
        youtube_videos: Array.isArray(member.youtube_videos) 
          ? member.youtube_videos.map((video: any) => ({
              title: typeof video.title === 'string' ? video.title : '',
              url: typeof video.url === 'string' ? video.url : ''
            }))
          : [],
        website_url: member.website_url,
        specialization: member.specialization || [],
        content_themes: member.content_themes || [],
        profile_image_url: member.channel_avatar_url || member.profile_image_url,
        member_count: member.number_of_subscribers || 0,
        join_url: member.url,
        platform: member.niche,
        points: 0,
        rank: null,
        contribution_count: member.channel_total_videos || 0,
        referral_count: 0,
        slug: member.slug
      }));
    },
  });

  const stats = {
    totalEducators: members?.length || 0,
    totalVideos: members?.reduce((acc, member) => acc + (member.contribution_count || 0), 0) || 0,
    totalStudents: members?.reduce((acc, member) => acc + (member.member_count || 0), 0) || 0
  };

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Enhanced Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 p-8 border border-siso-border shadow-lg backdrop-blur-sm"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-8 h-8 text-siso-orange" />
                <GradientText
                  colors={["#FF5722", "#FFA726", "#FF5722"]}
                  animationSpeed={6}
                  className="text-4xl font-bold"
                >
                  SISO EDUCATION HUB
                </GradientText>
              </div>
              
              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
                >
                  <div className="text-2xl font-bold text-siso-orange">{stats.totalEducators}</div>
                  <div className="text-siso-text/80">Educators</div>
                </motion.div>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
                >
                  <div className="text-2xl font-bold text-siso-orange">{stats.totalVideos}</div>
                  <div className="text-siso-text/80">Total Videos</div>
                </motion.div>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10"
                >
                  <div className="text-2xl font-bold text-siso-orange">{stats.totalStudents}</div>
                  <div className="text-siso-text/80">Total Students</div>
                </motion.div>
              </div>

              {/* Search and Filters */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-siso-text/50" />
                  <Input
                    type="text"
                    placeholder="Search educators, topics, or videos..."
                    className="w-full pl-10 bg-white/5 border-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularCategories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="hover:bg-siso-orange/20 cursor-pointer transition-colors"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Navigation */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <Tabs defaultValue={activeSection} className="w-full md:w-auto">
              <TabsList className="bg-white/5 border border-white/10">
                <TabsTrigger 
                  value="videos"
                  onClick={() => setActiveSection('videos')}
                  className="data-[state=active]:bg-siso-orange"
                >
                  Videos
                </TabsTrigger>
                <TabsTrigger 
                  value="educators"
                  onClick={() => setActiveSection('educators')}
                  className="data-[state=active]:bg-siso-orange"
                >
                  Educators
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode('grid')}
                      className={viewMode === 'grid' ? 'text-siso-orange' : 'text-siso-text/50'}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Grid View</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setViewMode('list')}
                      className={viewMode === 'list' ? 'text-siso-orange' : 'text-siso-text/50'}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>List View</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Filter</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <SlidersHorizontal className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Sort</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Content Sections */}
          <AnimatePresence mode="wait">
            {activeSection === 'videos' ? (
              <VideoLibrary
                key="video-library"
                isLoading={isLoading}
                selectedEducator={null}
                viewMode={viewMode}
                searchQuery={searchQuery}
              />
            ) : (
              <EducatorsDirectory
                key="educators-directory"
                members={members}
                isLoading={isLoading}
                viewMode={viewMode}
                searchQuery={searchQuery}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}