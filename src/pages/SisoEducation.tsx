import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sidebar } from '@/components/Sidebar';
import { CommunitySearch } from '@/components/community/CommunitySearch';
import { CommunityMemberCard } from '@/components/community/CommunityMemberCard';
import { CommunityMemberDetails } from '@/components/community/CommunityMemberDetails';
import { CommunityMember } from '@/components/community/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ExternalLink, GraduationCap, Users, Trophy, BookOpen, Search, Filter, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProjectDocumentation } from '@/components/education/ProjectDocumentation';
import { GradientText } from '@/components/ui/gradient-text';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const contentThemes = [
  'AI Development',
  'Machine Learning',
  'Data Science',
  'Web Development',
  'Blockchain',
  'Cloud Computing',
  'DevOps',
  'Security'
];

export default function SisoEducation() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<CommunityMember | null>(null);
  const [selectedThemes, setSelectedThemes] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showDocs, setShowDocs] = useState(false);

  const { data: members, isLoading, error } = useQuery({
    queryKey: ['education-creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('education_creators')
        .select('*');
      
      if (error) throw error;
      
      return data.map(member => ({
        id: member.id,
        name: member.name,
        description: member.description,
        member_type: member.member_type,
        youtube_url: member.youtube_url,
        youtube_videos: member.youtube_videos as { title: string; url: string; }[] | null,
        website_url: member.website_url,
        specialization: member.specialization,
        content_themes: member.content_themes,
        profile_image_url: member.profile_image_url,
        member_count: null,
        join_url: null,
        platform: null,
        points: 0,
        rank: null,
        contribution_count: 0,
        referral_count: 0
      })) as CommunityMember[];
    },
  });

  const toggleTheme = (theme: string) => {
    setSelectedThemes(prev => 
      prev.includes(theme) 
        ? prev.filter(t => t !== theme)
        : [...prev, theme]
    );
  };

  const filteredMembers = members?.filter(member => {
    const matchesSearch = !searchQuery || 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesThemes = selectedThemes.length === 0 || 
      selectedThemes.some(theme => member.content_themes?.includes(theme));

    const matchesTab = activeTab === 'all' || 
      (activeTab === 'featured' && member.specialization?.includes('Featured')) ||
      (activeTab === 'new' && new Date(member.created_at || '').getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);

    return matchesSearch && matchesThemes && matchesTab;
  });

  const stats = [
    { icon: Users, label: 'Active Educators', value: members?.length || 0 },
    { icon: Trophy, label: 'Learning Paths', value: '12+' },
    { icon: BookOpen, label: 'Resources', value: '500+' },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-b from-siso-bg to-siso-bg/95">
      <Sidebar />
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-siso-red/10 to-siso-orange/10 p-8 border border-siso-border shadow-lg backdrop-blur-sm"
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <GraduationCap className="w-8 h-8 text-siso-orange" />
                <GradientText
                  colors={["#FF5722", "#FFA726", "#FF5722"]}
                  animationSpeed={6}
                  className="text-4xl font-bold"
                >
                  SISO EDUCATION HUB
                </GradientText>
              </div>
              <p className="text-siso-text/80 max-w-2xl mb-8 text-lg">
                Access quality AI education and expert insights. Learn from industry leaders and stay ahead in the rapidly evolving world of artificial intelligence.
              </p>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={item}
                    className="flex items-center gap-4 p-4 rounded-lg bg-black/20 border border-siso-border hover:border-siso-border-hover transition-colors"
                  >
                    <stat.icon className="w-8 h-8 text-siso-orange" />
                    <div>
                      <div className="text-2xl font-bold text-siso-text-bold">{stat.value}</div>
                      <div className="text-sm text-siso-text/70">{stat.label}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* List Learner Callout Box */}
          <Alert className="border border-[#0FA0CE]/20 bg-gradient-to-r from-[#0FA0CE]/5 to-transparent backdrop-blur-sm rounded-xl shadow-lg">
            <AlertDescription className="flex items-center justify-between gap-4 p-2">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-[#0FA0CE] mb-1">Scale Your Learning Programs</h3>
                <p className="text-siso-text/90">
                  List Learner is a powerful B2B education infrastructure platform - perfect for agencies, businesses, and individuals looking to scale their learning programs.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                className="shrink-0 border-[#0FA0CE] text-[#0FA0CE] hover:bg-[#0FA0CE]/10 hover:text-[#0FA0CE] transition-all shadow-sm"
              >
                <a 
                  href="https://demo.listlearner.com/?ref=sourcesiso" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2"
                >
                  Try it Free <ExternalLink size={16} />
                </a>
              </Button>
            </AlertDescription>
          </Alert>

          {/* Search and Filters */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/50" />
                <Input
                  type="text"
                  placeholder="Search educators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-siso-bg-alt border-siso-border"
                />
              </div>
              <Button
                variant="outline"
                className="w-full md:w-auto flex items-center gap-2"
                onClick={() => setSelectedThemes([])}
              >
                <Filter className="w-4 h-4" />
                Clear Filters
              </Button>
            </div>

            {/* Content Theme Filters */}
            <div className="flex flex-wrap gap-2">
              {contentThemes.map((theme) => (
                <Badge
                  key={theme}
                  variant={selectedThemes.includes(theme) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-siso-red/10"
                  onClick={() => toggleTheme(theme)}
                >
                  {theme}
                </Badge>
              ))}
            </div>

            {/* Tabs */}
            <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="bg-siso-bg-alt border border-siso-border">
                <TabsTrigger value="all">All Educators</TabsTrigger>
                <TabsTrigger value="featured">Featured</TabsTrigger>
                <TabsTrigger value="new">Recently Added</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Members Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + selectedThemes.join() + searchQuery}
              variants={container}
              initial="hidden"
              animate="show" 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {isLoading ? (
                // Loading skeletons
                [...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-siso-bg-alt rounded-lg"></div>
                  </div>
                ))
              ) : error ? (
                <div className="col-span-full flex items-center justify-center min-h-[200px]">
                  <div className="text-red-500">Error loading education creators. Please try again later.</div>
                </div>
              ) : filteredMembers?.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center min-h-[200px] text-siso-text/70">
                  <div className="text-lg mb-2">No educators found</div>
                  <div className="text-sm">Try adjusting your search or filters</div>
                </div>
              ) : (
                filteredMembers?.map((member) => (
                  <motion.div key={member.id} variants={item} layout>
                    <CommunityMemberCard
                      member={member}
                      onClick={setSelectedMember}
                    />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>

          <CommunityMemberDetails
            member={selectedMember}
            onClose={() => setSelectedMember(null)}
          />
        </div>
      </div>
    </div>
  );
}
