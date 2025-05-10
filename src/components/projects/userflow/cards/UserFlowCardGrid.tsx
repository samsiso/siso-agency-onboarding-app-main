import React, { useState, useEffect } from 'react';
import { UserFlowCard, UserFlowCardProps } from './UserFlowCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Grid3X3, LayoutGrid, PlusCircle, Star, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// Sample flow data for demonstration
const sampleFlows: UserFlowCardProps[] = [
  {
    id: 'flow-1',
    title: 'Main User Authentication Flow',
    description: 'Core authentication flow including login, signup, password reset, and 2FA integration',
    type: 'core',
    lastUpdated: '2023-07-15T10:30:00Z',
    views: 1250,
    feedbackCount: 7,
    imageUrl: 'https://cdn.dribbble.com/userupload/10071663/file/original-72df25cd27bcbb20db2077df19e9c40d.png?resize=752x',
  },
  {
    id: 'flow-2',
    title: 'Onboarding Sequence',
    description: 'New user onboarding flow with profile setup, preferences, and tutorial guidance',
    type: 'core',
    lastUpdated: '2023-07-10T14:45:00Z',
    views: 980,
    feedbackCount: 5,
    imageUrl: 'https://cdn.dribbble.com/userupload/5851832/file/original-b02d54851900b4866fd53d8c8d84a0ec.jpg?resize=752x',
  },
  {
    id: 'flow-3',
    title: 'Transaction Process',
    description: 'Complete crypto transaction flow from initiation to confirmation',
    type: 'core',
    lastUpdated: '2023-07-05T11:20:00Z',
    views: 875,
    feedbackCount: 3,
    imageUrl: 'https://cdn.dribbble.com/userupload/8586347/file/original-46511db30649b65a113c4f081be065ad.png?resize=752x',
  },
  {
    id: 'flow-4',
    title: 'Account Settings',
    description: 'User settings management including profile, security, and preferences',
    type: 'secondary',
    lastUpdated: '2023-06-28T09:15:00Z',
    views: 650,
    feedbackCount: 2,
    imageUrl: 'https://cdn.dribbble.com/userupload/10060656/file/original-cefa7e0ede9d856b6afcaa7e95b370bc.png?resize=1200x900',
  },
  {
    id: 'flow-5',
    title: 'Wallet Integration',
    description: 'External wallet connection and management flow',
    type: 'secondary',
    lastUpdated: '2023-06-22T16:40:00Z',
    views: 712,
    feedbackCount: 2,
    imageUrl: 'https://cdn.dribbble.com/userupload/7804220/file/original-ae2a9dc2e1a07c71f0d9b31974dad47b.jpeg?resize=752x',
  },
  {
    id: 'flow-6',
    title: 'Error Handling Paths',
    description: 'Detailed diagrams of possible error states and recovery paths',
    type: 'detailed',
    lastUpdated: '2023-06-18T13:30:00Z',
    views: 320,
    feedbackCount: 1,
    imageUrl: 'https://cdn.dribbble.com/userupload/5727134/file/original-1ac1a579cb44b37f08dfc1fcf3d5b3d7.png?resize=752x',
  },
  {
    id: 'flow-7',
    title: 'Mobile App Navigation',
    description: 'Complete navigation structure for the mobile application',
    type: 'secondary',
    lastUpdated: '2023-06-15T10:00:00Z',
    views: 480,
    feedbackCount: 0,
    imageUrl: 'https://cdn.dribbble.com/userupload/6869617/file/original-8af28433ebd28c2d05bb8cc8ed97c071.png?resize=752x',
  },
  {
    id: 'flow-8',
    title: 'Admin Dashboard Flow',
    description: 'Flow diagrams for administrator dashboard and controls',
    type: 'detailed',
    lastUpdated: '2023-06-10T15:20:00Z',
    views: 290,
    feedbackCount: 0,
    imageUrl: 'https://cdn.dribbble.com/userupload/10127167/file/original-0c3f2f2fcb1b17ea5c19365c64fe17ce.png?resize=752x',
  },
  {
    id: 'flow-9',
    title: 'NFT Marketplace Flow',
    description: 'Browse, purchase, and manage NFT assets in the crypto marketplace',
    type: 'core',
    lastUpdated: '2023-08-05T09:10:00Z',
    views: 1120,
    feedbackCount: 4,
    imageUrl: 'https://cdn.dribbble.com/userupload/9698882/file/original-6af7ca80a00acb272068f4e3c0df63f8.png?resize=752x',
  },
  {
    id: 'flow-10',
    title: 'Staking Process',
    description: 'User journey for crypto staking, rewards, and unstaking process',
    type: 'secondary',
    lastUpdated: '2023-07-28T13:25:00Z',
    views: 780,
    feedbackCount: 3,
    imageUrl: 'https://cdn.dribbble.com/userupload/10055760/file/original-aa3a0c01f17886553871c9624d7cffd5.png?resize=752x',
  },
  {
    id: 'flow-11',
    title: 'Social Features Integration',
    description: 'Social networking components including friends, followers, and sharing',
    type: 'detailed',
    lastUpdated: '2023-07-22T11:50:00Z',
    views: 450,
    feedbackCount: 2,
    imageUrl: 'https://cdn.dribbble.com/userupload/4022891/file/original-5a79f075a16e35d688e0842bcd0a9c9d.png?resize=752x',
  },
  {
    id: 'flow-12',
    title: 'Portfolio Performance Analytics',
    description: 'Interactive charts and analytics for crypto portfolio performance',
    type: 'secondary',
    lastUpdated: '2023-08-12T16:15:00Z',
    views: 550,
    feedbackCount: 1,
    imageUrl: 'https://cdn.dribbble.com/userupload/10123068/file/original-e8d0cea6dbe78f93b9a4dc6170613b4f.png?resize=752x',
  },
  {
    id: 'flow-13',
    title: 'Notification Center',
    description: 'User notification system including alerts, messages, and preferences',
    type: 'secondary',
    lastUpdated: '2023-08-18T14:20:00Z',
    views: 610,
    feedbackCount: 2,
    imageUrl: 'https://cdn.dribbble.com/userupload/6430172/file/original-d2aaf6e853be6451ccebe5a011df2b64.jpg?resize=752x',
  },
  {
    id: 'flow-14',
    title: 'User Profile Journey',
    description: 'Complete user profile setup, editing, and verification flow',
    type: 'core',
    lastUpdated: '2023-08-25T09:40:00Z',
    views: 890,
    feedbackCount: 4,
    imageUrl: 'https://cdn.dribbble.com/userupload/7595046/file/original-0f7fbe4bd4631f7b310abc01548bc402.png?resize=752x',
  },
  {
    id: 'flow-15',
    title: 'Help & Support System',
    description: 'User support workflow including ticket system, FAQ, and documentation',
    type: 'detailed',
    lastUpdated: '2023-09-02T11:30:00Z',
    views: 380,
    feedbackCount: 1,
    imageUrl: 'https://cdn.dribbble.com/users/418188/screenshots/17740783/media/e8ae2c0414bb3f4e31139b1e9c870d67.png?resize=752x',
  },
  {
    id: 'flow-16',
    title: 'Cross-Chain Transfer Process',
    description: 'Detailed flow for transferring assets across different blockchain networks',
    type: 'core',
    lastUpdated: '2023-09-10T15:45:00Z',
    views: 1350,
    feedbackCount: 6,
    imageUrl: 'https://cdn.dribbble.com/userupload/10125695/file/original-1c1af41671dd75408be19a04b5f0a3ae.png?resize=752x',
  },
];

type FlowType = 'all' | 'core' | 'secondary' | 'detailed';
type SortOption = 'newest' | 'oldest' | 'most-viewed' | 'most-feedback';

interface UserFlowCardGridProps {
  projectId: string;
}

export function UserFlowCardGrid({ projectId }: UserFlowCardGridProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<FlowType>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [layout, setLayout] = useState<'grid' | 'compact'>('grid');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simple loading animation effect
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort the flows based on current settings
  const filteredFlows = sampleFlows
    .filter(flow => {
      // Apply search filter
      const matchesSearch = 
        flow.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        flow.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Apply type filter
      const matchesType = typeFilter === 'all' || flow.type === typeFilter;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      // Apply sorting
      switch (sortOption) {
        case 'newest':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'oldest':
          return new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime();
        case 'most-viewed':
          return (b.views || 0) - (a.views || 0);
        case 'most-feedback':
          return (b.feedbackCount || 0) - (a.feedbackCount || 0);
        default:
          return 0;
      }
    });

  const handleFlowClick = (flowId: string) => {
    navigate(`/projects/${projectId}/userflow/${flowId}`);
  };

  const totalViews = sampleFlows.reduce((sum, flow) => sum + (flow.views || 0), 0);
  const totalFeedback = sampleFlows.reduce((sum, flow) => sum + (flow.feedbackCount || 0), 0);
  const coreFlowsCount = sampleFlows.filter(flow => flow.type === 'core').length;

  // Animation variants for cards
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <div className="space-y-6">
      {/* Hero banner with statistics */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-900/80 via-violet-900/80 to-purple-900/80 border border-indigo-500/30 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-300" />
              User Flow Collection
            </h2>
            <p className="text-indigo-200 text-sm max-w-2xl">
              Browse, search and manage all user flows for this project. Create new flows or edit existing ones to document your application's user journey.
            </p>
          </div>
          <Button 
            className="mt-4 md:mt-0 bg-white/10 hover:bg-white/20 text-white border border-white/20 shadow-lg"
            size="sm"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Flow
          </Button>
        </div>
        
        {/* Statistics row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="bg-black/30 rounded-lg border border-indigo-500/20 p-3">
            <p className="text-xs text-indigo-300 mb-1">Total User Flows</p>
            <p className="text-2xl font-bold text-white">{sampleFlows.length}</p>
          </div>
          <div className="bg-black/30 rounded-lg border border-indigo-500/20 p-3">
            <p className="text-xs text-indigo-300 mb-1">Core User Flows</p>
            <p className="text-2xl font-bold text-white flex items-center gap-1">
              {coreFlowsCount}
              <Star className="h-4 w-4 text-indigo-400 fill-indigo-400" />
            </p>
          </div>
          <div className="bg-black/30 rounded-lg border border-indigo-500/20 p-3">
            <p className="text-xs text-indigo-300 mb-1">Total Views</p>
            <p className="text-2xl font-bold text-white">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-black/30 rounded-lg border border-indigo-500/20 p-3">
            <p className="text-xs text-indigo-300 mb-1">Total Feedback</p>
            <p className="text-2xl font-bold text-white">{totalFeedback}</p>
          </div>
        </div>
      </div>
      
      {/* Filter and search bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search user flows..."
            className="pl-9 bg-black/20 border-gray-800"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          <Select value={typeFilter} onValueChange={(value: FlowType) => setTypeFilter(value)}>
            <SelectTrigger className="w-[140px] bg-black/20 border-gray-800">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-gray-500" />
                <span>
                  {typeFilter === 'all' ? 'All Types' : 
                   typeFilter === 'core' ? 'Core Flows' : 
                   typeFilter === 'secondary' ? 'Secondary' : 'Detailed'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="core">Core Flows</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
            <SelectTrigger className="w-[140px] bg-black/20 border-gray-800">
              <div className="flex items-center">
                {sortOption.includes('newest') ? (
                  <ArrowDown className="mr-2 h-4 w-4 text-gray-500" />
                ) : sortOption.includes('oldest') ? (
                  <ArrowUp className="mr-2 h-4 w-4 text-gray-500" />
                ) : (
                  <Filter className="mr-2 h-4 w-4 text-gray-500" />
                )}
                <span>
                  {sortOption === 'newest' ? 'Newest' : 
                   sortOption === 'oldest' ? 'Oldest' : 
                   sortOption === 'most-viewed' ? 'Most Viewed' : 
                   'Most Feedback'}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="most-viewed">Most Viewed</SelectItem>
              <SelectItem value="most-feedback">Most Feedback</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center bg-black/20 rounded-md border border-gray-800 p-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${layout === 'grid' ? 'bg-gray-700' : 'bg-transparent text-gray-400'}`}
              onClick={() => setLayout('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className={`h-8 w-8 ${layout === 'compact' ? 'bg-gray-700' : 'bg-transparent text-gray-400'}`}
              onClick={() => setLayout('compact')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="text-sm text-gray-400">
        Showing {filteredFlows.length} of {sampleFlows.length} user flows
      </div>
      
      {/* Card grid with staggered animation */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate={isLoaded ? "show" : "hidden"}
        className={`grid gap-6 ${
          layout === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
        }`}
      >
        {filteredFlows.map((flow) => (
          <motion.div key={flow.id} variants={item}>
            <UserFlowCard 
              {...flow} 
              onClick={handleFlowClick}
            />
          </motion.div>
        ))}
      </motion.div>
      
      {/* Empty state */}
      {filteredFlows.length === 0 && (
        <div className="py-12 text-center bg-black/20 rounded-lg border border-gray-800">
          <p className="text-gray-400 mb-2">No user flows match your search criteria.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => {
              setSearchQuery('');
              setTypeFilter('all');
            }}
            className="bg-transparent border-gray-700"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
} 