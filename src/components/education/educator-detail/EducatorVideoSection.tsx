import { useState } from 'react';
import { VideoLibrary } from '@/components/education/VideoLibrary';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, LayoutGrid, LayoutList } from 'lucide-react';
import { motion } from 'framer-motion';

interface EducatorVideoSectionProps {
  educatorId: string;
}

export const EducatorVideoSection = ({ educatorId }: EducatorVideoSectionProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');

  console.log('EducatorVideoSection received educatorId:', educatorId); // Debug log

  return (
    <div className="space-y-6">
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <TabsList className="bg-siso-bg-alt border border-siso-border h-11">
            <TabsTrigger value="all">All Videos</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="series">Series</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-3">
            <Select value={viewMode} onValueChange={(value: 'grid' | 'list') => setViewMode(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="grid">
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    <span>Grid</span>
                  </div>
                </SelectItem>
                <SelectItem value="list">
                  <div className="flex items-center gap-2">
                    <LayoutList className="w-4 h-4" />
                    <span>List</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="oldest">Oldest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-siso-text/50" />
          <Input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TabsContent value="all">
            <VideoLibrary
              selectedEducator={educatorId}
              viewMode={viewMode}
              searchQuery={searchQuery}
              sortBy={sortBy}
              isLoading={false}
            />
          </TabsContent>
          <TabsContent value="popular">
            <VideoLibrary
              selectedEducator={educatorId}
              viewMode={viewMode}
              searchQuery={searchQuery}
              sortBy="popular"
              isLoading={false}
            />
          </TabsContent>
          <TabsContent value="recent">
            <VideoLibrary
              selectedEducator={educatorId}
              viewMode={viewMode}
              searchQuery={searchQuery}
              sortBy="recent"
              isLoading={false}
            />
          </TabsContent>
          <TabsContent value="series">
            <VideoLibrary
              selectedEducator={educatorId}
              viewMode={viewMode}
              searchQuery={searchQuery}
              sortBy={sortBy}
              filterBySeries={true}
              isLoading={false}
            />
          </TabsContent>
        </motion.div>
      </Tabs>
    </div>
  );
};