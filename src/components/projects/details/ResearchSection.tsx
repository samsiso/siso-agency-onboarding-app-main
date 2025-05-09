import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ResearchDocument } from './types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { FileText, Search, SlidersHorizontal, AlertCircle, X, Plus, Calendar } from 'lucide-react';
import { PinnedResearchAsset } from './research/PinnedResearchAsset';
import { ResearchDocumentCard } from './research/ResearchDocument';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ResearchCategories } from './research/ResearchCategories';
import { ResearchFilters } from './research/ResearchFilters';

// Define categories with their colors
const categories = ['All', 'Market Research', 'Technical', 'UX Research', 'Legal', 'Competition', 'Project Planning'];

const categoryColors: Record<string, string> = {
  'Market Research': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  'Technical': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'UX Research': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Legal': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  'Competition': 'bg-red-500/10 text-red-500 border-red-500/20',
  'Project Planning': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
};

// Create enhanced mock data - exported for reuse in ResearchDocumentDetail
export const createEnhancedMockData = (): ResearchDocument[] => {
  return [
    {
      id: '1',
      title: 'Cryptocurrency Market Analysis 2025',
      description: 'In-depth analysis of current market trends, key players, and future projections for the cryptocurrency landscape.',
      content: 'In-depth analysis of current market trends, key players, and future projections for the cryptocurrency landscape. Key trends predict a 30% rise in DeFi adoption by 2025. NFT marketplaces forecasted to consolidate by 40%. This research provides critical insights for strategic positioning in the evolving crypto market.',
      category: 'Market Research',
      section: 'Market Research',
      created_at: '2025-03-15T10:30:00Z',
      updated_at: '2025-04-01T14:20:00Z',
      tags: ['market', 'trends', 'analysis'],
      insights: ['Key trends predict a 30% rise in DeFi adoption by 2025', 'NFT marketplaces forecasted to consolidate by 40%'],
      nextSteps: ['Consider DeFi integration in phase 2', 'Monitor regulation developments in EU markets'],
      isPinned: true,
      order_index: 1,
      project_id: 'ubahcrypt',
      related_components: ['market', 'trends', 'analysis']
    },
    {
      id: '2',
      title: 'Smart Contract Security Best Practices',
      description: 'Comprehensive guide on implementing secure smart contracts, common vulnerabilities, and auditing procedures.',
      content: 'Comprehensive guide on implementing secure smart contracts, common vulnerabilities, and auditing procedures. Our research shows 75% of vulnerabilities come from reentrancy attacks, while formal verification reduces exploits by 62%. We recommend adopting multi-sig wallets for enhanced security and scheduling quarterly security audits.',
      category: 'Technical',
      section: 'Technical',
      created_at: '2025-02-10T09:15:00Z',
      updated_at: '2025-04-10T11:45:00Z',
      tags: ['security', 'smart contracts', 'audit'],
      insights: ['75% of vulnerabilities come from reentrancy attacks', 'Formal verification reduces exploits by 62%'],
      nextSteps: ['Recommendation: Adopt multi-sig wallets for enhanced security', 'Schedule quarterly security audits'],
      code_snippet: '// Example multi-signature wallet pattern\ncontract MultiSigWallet {\n  mapping(address => bool) public isOwner;\n  uint public required;\n\n  function execute(address dest, uint value, bytes data) public {\n    // Implementation\n  }\n}',
      fileUrl: '#',
      isPinned: true,
      order_index: 2,
      project_id: 'ubahcrypt',
      related_components: ['security', 'smart contracts', 'audit']
    },
    {
      id: '3',
      title: 'User Experience in Crypto Applications',
      description: 'Research on optimizing user experience for cryptocurrency applications with focus on simplicity and security.',
      content: 'Research on optimizing user experience for cryptocurrency applications with focus on simplicity and security. Simple onboarding increases conversion by 46%, and educational tooltips reduce support tickets by 32%. We recommend implementing guided wallet setup and adding interactive tutorials for new users.',
      category: 'UX Research',
      section: 'UX Research',
      created_at: '2025-01-25T15:40:00Z',
      updated_at: '2025-03-18T09:30:00Z',
      tags: ['UX', 'design', 'usability'],
      insights: ['Simple onboarding increases conversion by 46%', 'Educational tooltips reduce support tickets by 32%'],
      nextSteps: ['Implement guided wallet setup', 'Add interactive tutorials for new users'],
      isPinned: false,
      order_index: 3,
      project_id: 'ubahcrypt',
      related_components: ['UX', 'design', 'usability']
    },
    {
      id: '4',
      title: 'Regulatory Compliance Framework',
      description: 'Analysis of global regulatory requirements and compliance frameworks for cryptocurrency platforms.',
      content: 'Analysis of global regulatory requirements and compliance frameworks for cryptocurrency platforms. KYC implementation needed in 89% of jurisdictions and AML policies required for all fiat on/off ramps. We recommend developing a compliance checklist for each target market and consulting with legal team on KYC implementation.',
      category: 'Legal',
      section: 'Legal',
      created_at: '2025-03-05T11:20:00Z',
      updated_at: '2025-04-15T10:10:00Z',
      tags: ['legal', 'compliance', 'regulation'],
      insights: ['KYC implementation needed in 89% of jurisdictions', 'AML policies required for all fiat on/off ramps'],
      nextSteps: ['Develop compliance checklist for each target market', 'Consult with legal team on KYC implementation'],
      fileUrl: '#',
      isPinned: false,
      order_index: 4,
      project_id: 'ubahcrypt',
      related_components: ['legal', 'compliance', 'regulation']
    },
    {
      id: '5',
      title: 'Competitor Analysis 2025',
      description: 'Detailed analysis of major competitors in the cryptocurrency exchange market.',
      content: 'Detailed analysis of major competitors in the cryptocurrency exchange market, including market share, unique features, and competitive advantages. The research identifies key differentiation opportunities and potential threats from emerging platforms.',
      category: 'Competition',
      section: 'Competition',
      created_at: '2025-03-20T09:45:00Z',
      updated_at: '2025-04-17T13:30:00Z',
      tags: ['competition', 'market', 'analysis'],
      insights: ['Top 5 exchanges control 72% of market volume', 'DeFi integration is the primary growth strategy'],
      nextSteps: ['Focus on exclusive staking features', 'Develop unique cross-chain capabilities'],
      isPinned: false,
      order_index: 5,
      project_id: 'ubahcrypt',
      related_components: ['competition', 'market', 'analysis']
    }
  ];
};

export function ResearchSection() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [researchDocuments, setResearchDocuments] = useState<ResearchDocument[]>([]);
  const [expandedDocs, setExpandedDocs] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'updated' | 'title' | 'category'>('updated');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  // New document form state
  const [newDocument, setNewDocument] = useState({
    title: '',
    content: '',
    section: 'Market Research',
    related_components: [],
    tags: ''
  });

  // Function to fetch research documents from Supabase or fallback to mock data
  const fetchResearchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try Supabase first but prepare for failure
      const mockData = createEnhancedMockData();
      
      try {
        // Attempt to fetch from Supabase
        const { data, error } = await supabase
          .from('project_documentation')
          .select('*')
          .order('created_at', { ascending: false });
          
        // Use Supabase data if available
        if (!error && data && data.length > 0) {
          console.log('Successfully loaded data from Supabase:', data.length);
          
          // Transform the data
          const formattedData: ResearchDocument[] = data.map(doc => ({
            id: doc.id || `doc-${Math.random()}`,
            title: doc.title || 'Untitled Document',
            description: doc.content ? (doc.content.substring(0, 150) + '...') : 'No description available',
            content: doc.content || 'Detailed content unavailable',
            category: doc.section || 'Uncategorized',
            section: doc.section || 'general',
            created_at: doc.created_at || new Date().toISOString(),
            updated_at: doc.updated_at || new Date().toISOString(),
            tags: doc.related_components || [], 
            project_id: doc.project_id || projectId || 'default',
            order_index: doc.order_index || 999,
            related_components: doc.related_components || [],
            isPinned: doc.order_index !== null && doc.order_index < 3,
          }));
          
          setResearchDocuments(formattedData);
        } else {
          // Fall back to mock data
          console.log('No data in Supabase, using mock data');
          setResearchDocuments(mockData);
        }
      } catch (supabaseError) {
        // Handle Supabase error gracefully
        console.log('Supabase error, using mock data:', supabaseError);
        setResearchDocuments(mockData);
      }
    } catch (err) {
      // Ultimate fallback - this should never fail
      console.error('Error in research documents logic:', err);
      const ultimateFallbackData = createEnhancedMockData();
      setResearchDocuments(ultimateFallbackData);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to add a new document to Supabase
  const addNewDocument = async () => {
    if (!newDocument.title.trim() || !newDocument.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both title and content for the document.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert tags string to array
      const tagsArray = newDocument.tags
        ? newDocument.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];
        
      // Prepare document data
      const documentData = {
        title: newDocument.title,
        content: newDocument.content,
        section: newDocument.section,
        related_components: tagsArray,
        project_id: projectId || 'default',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        order_index: 999, // High number for non-pinned items
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('project_documentation')
        .insert(documentData)
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Success handling
      toast({
        title: "Document Added",
        description: "Your research document has been successfully added.",
      });
      
      // Reset form and close dialog
      setNewDocument({
        title: '',
        content: '',
        section: 'Market Research',
        related_components: [],
        tags: ''
      });
      setIsDialogOpen(false);
      
      // Refresh documents list
      fetchResearchDocuments();
      
    } catch (err) {
      console.error('Error adding document:', err);
      toast({
        title: "Error",
        description: `Failed to add document: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Reset form when dialog closes
  const handleDialogClose = () => {
    setNewDocument({
      title: '',
      content: '',
      section: 'Market Research',
      related_components: [],
      tags: ''
    });
    setIsDialogOpen(false);
  };
  
  // Fetch research documents on component mount and when projectId changes
  useEffect(() => {
    fetchResearchDocuments();
  }, [projectId]);

  // Toggle expanded state for a document
  const toggleExpanded = (docId: string) => {
    setExpandedDocs(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  // Handle document click - navigate to document detail page
  const handleDocumentClick = (doc: ResearchDocument) => {
    console.log('Document clicked:', doc.title);
    navigate(`/projects/${projectId}/market-research/${doc.id}`);
  };

  // Get count of documents in a category
  const getCategoryCount = (category: string) => {
    return researchDocuments.filter(doc => 
      category === 'All' || doc.category === category
    ).length;
  };

  // Filter documents by category and search query
  const filteredDocuments = researchDocuments.filter(doc => {
    const categoryMatch = activeCategory === 'All' || doc.category === activeCategory;
    const searchMatch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return categoryMatch && searchMatch;
  });

  // Sort documents by selected criteria
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    if (sortBy === 'updated') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    } else if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    return 0;
  });

  // Separate pinned and regular documents
  const pinnedDocs = sortedDocuments.filter(doc => doc.isPinned);
  const regularDocs = sortedDocuments.filter(doc => !doc.isPinned);
  
  // Render loading skeletons while data is being fetched
  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array(5).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-full" />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-8 justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Research Documents</h2>
          <p className="text-muted-foreground">Explore our research findings and background information for UbahCryp.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <ResearchFilters 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  className="group" 
                  onClick={() => setIsDialogOpen(true)}
                >  
                  <FileText className="mr-2 h-4 w-4" />
                  Add Document
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new research documents</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {/* Add Document Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Research Document</DialogTitle>
                <DialogDescription>
                  Create a new research document to share with your team.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Document Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter document title"
                    value={newDocument.title}
                    onChange={(e) => setNewDocument({...newDocument, title: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="section">Category</Label>
                  <Select 
                    value={newDocument.section} 
                    onValueChange={(value) => setNewDocument({...newDocument, section: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.filter(cat => cat !== 'All').map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="content">Document Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Enter the document content"
                    className="min-h-[150px]"
                    value={newDocument.content}
                    onChange={(e) => setNewDocument({...newDocument, content: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="blockchain, security, analysis"
                    value={newDocument.tags}
                    onChange={(e) => setNewDocument({...newDocument, tags: e.target.value})}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={handleDialogClose} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button onClick={addNewDocument} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Document"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error}
            <Button 
              variant="link" 
              className="text-white p-0 ml-2 underline"
              onClick={() => {
                setIsLoading(true);
                setError(null);
                setTimeout(() => {
                  window.location.reload();
                }, 500);
              }}
            >
              Refresh
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <ResearchCategories
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryColors={categoryColors}
        getCategoryCount={getCategoryCount}
      />
      
      {pinnedDocs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white/90 mb-3 border-b border-white/10 pb-2">
            Pinned Project Assets
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pinnedDocs.map((doc) => (
              <PinnedResearchAsset 
                key={doc.id} 
                doc={doc} 
                categoryColors={categoryColors}
                onClick={() => handleDocumentClick(doc)}
              />
            ))}
          </div>
        </div>
      )}
      
      {regularDocs.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-white/90 mb-3 border-b border-white/10 pb-2">
            All Research Documents
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regularDocs.map((doc) => (
              <ResearchDocumentCard
                key={doc.id}
                doc={doc}
                categoryColors={categoryColors}
                isExpanded={!!expandedDocs[doc.id]}
                onToggleExpand={() => toggleExpanded(doc.id)}
                onClick={() => handleDocumentClick(doc)}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed rounded-lg border-white/20">
          <FileText className="mx-auto h-12 w-12 text-neutral-500 mb-3" />
          <h3 className="text-xl font-medium text-white">No documents found</h3>
          <p className="text-neutral-400 max-w-md mx-auto mt-2">
            {activeCategory !== 'All' 
              ? `No documents in the '${activeCategory}' category.` 
              : 'Try adjusting your filters or add a new document.'}
          </p>
          <Button 
            className="mt-4" 
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Research Document
          </Button>
        </div>
      )}
    </div>
  );
}
