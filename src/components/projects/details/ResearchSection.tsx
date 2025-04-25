
import { Card } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Search, Tag, Download, Calendar, Clock } from 'lucide-react';

type ResearchDocument = {
  id: string;
  title: string;
  description: string;
  category: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  fileUrl?: string;
};

// Mock data - would be replaced with real data from API/database
const researchDocuments: ResearchDocument[] = [
  {
    id: '1',
    title: 'Cryptocurrency Market Analysis 2025',
    description: 'In-depth analysis of current market trends, key players, and future projections for the cryptocurrency landscape.',
    category: 'Market Research',
    created_at: '2025-03-15T10:30:00Z',
    updated_at: '2025-04-01T14:20:00Z',
    tags: ['market', 'trends', 'analysis'],
  },
  {
    id: '2',
    title: 'Smart Contract Security Best Practices',
    description: 'Comprehensive guide on implementing secure smart contracts, common vulnerabilities, and auditing procedures.',
    category: 'Technical',
    created_at: '2025-02-10T09:15:00Z',
    updated_at: '2025-04-10T11:45:00Z',
    tags: ['security', 'smart contracts', 'audit'],
  },
  {
    id: '3',
    title: 'User Experience in Crypto Applications',
    description: 'Research on optimizing user experience for cryptocurrency applications with focus on simplicity and security.',
    category: 'UX Research',
    created_at: '2025-01-25T15:40:00Z',
    updated_at: '2025-03-18T09:30:00Z',
    tags: ['UX', 'design', 'usability'],
  },
  {
    id: '4',
    title: 'Regulatory Compliance Framework',
    description: 'Analysis of global regulatory requirements and compliance frameworks for cryptocurrency platforms.',
    category: 'Legal',
    created_at: '2025-03-05T11:20:00Z',
    updated_at: '2025-04-15T10:10:00Z',
    tags: ['legal', 'compliance', 'regulation'],
  },
];

const categories = ['All', 'Market Research', 'Technical', 'UX Research', 'Legal', 'Competition'];

export function ResearchSection() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Research Documents</h2>
          <p className="text-neutral-400">Explore our research findings and background information for Ubahcrypt.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              className="pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-md text-white w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            />
          </div>
          <Button className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white">
            Add Document
          </Button>
        </div>
      </div>
      
      <div className="flex flex-nowrap overflow-x-auto pb-2 gap-2 scrollbar-hide">
        {categories.map((category) => (
          <Badge 
            key={category} 
            variant={category === 'All' ? 'purple' : 'secondary'} 
            className="cursor-pointer px-4 py-2 whitespace-nowrap"
          >
            {category}
          </Badge>
        ))}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchDocuments.map((doc) => (
          <AnimatedCard key={doc.id} className="border border-white/10">
            <div className="flex flex-col h-full">
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="secondary" className="bg-black/30">{doc.category}</Badge>
                <div className="text-xs text-neutral-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> 
                  Updated {new Date(doc.updated_at).toLocaleDateString()}
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{doc.title}</h3>
              <p className="text-neutral-400 text-sm mb-4 flex-grow">{doc.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />{tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex justify-between items-center mt-2">
                <Button variant="ghost" className="text-[#9b87f5] hover:text-[#8a76e4] p-0">
                  View Details
                </Button>
                <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </AnimatedCard>
        ))}
      </div>
    </div>
  );
}
