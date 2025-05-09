import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, Download, ExternalLink, ChevronLeft, Edit, Save, X, Plus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

// Define the ResearchDocument interface
interface ResearchDocument {
  id: string;
  title: string;
  description?: string;
  content: string;
  category: string;
  section: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  insights?: string[];
  nextSteps?: string[];
  code_snippet?: string;
  fileUrl?: string;
  project_id: string;
  isPinned?: boolean;
  order_index?: number;
  related_components?: string[];
}

// Mock data for fallback
const createLocalMockData = (): ResearchDocument[] => {
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
      nextSteps: ['Adopt multi-sig wallets for enhanced security', 'Schedule quarterly security audits'],
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
    }
  ];
};

export function ResearchDocumentDetail() {
  const { projectId, documentId } = useParams<{ projectId: string; documentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const contentRef = useRef<HTMLDivElement>(null);
  
  // State for admin editing mode
  const [isAdmin, setIsAdmin] = useState(false); 
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [document, setDocument] = useState<ResearchDocument | null>(null);
  const [editedDocument, setEditedDocument] = useState<ResearchDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Tags and insights management
  const [newTag, setNewTag] = useState('');
  const [newInsight, setNewInsight] = useState('');
  const [newStep, setNewStep] = useState('');
  
  // Categories with colors
  const categoryColors: Record<string, string> = {
    'Market Research': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Technical': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'UX Research': 'bg-green-500/10 text-green-500 border-green-500/20',
    'Legal': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Competition': 'bg-red-500/10 text-red-500 border-red-500/20',
    'Project Planning': 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20'
  };

  // Check if user is admin
  useEffect(() => {
    // For demo purposes, always set as admin
    setIsAdmin(true); 
  }, []);
  
  // Reset edited document when document changes
  useEffect(() => {
    if (document) {
      setEditedDocument({...document});
    }
  }, [document]);
  
  // Enhanced scrolling behavior
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
      
      // Add custom styles for better scrolling
      contentRef.current.style.height = 'calc(100vh - 100px)';
      contentRef.current.style.scrollBehavior = 'smooth';
    }
    
    // Clean up function
    return () => {
      if (contentRef.current) {
        contentRef.current.style.height = '';
        contentRef.current.style.scrollBehavior = '';
      }
    };
  }, [document]);
  
  // Fetch the document data
  useEffect(() => {
    if (!documentId) return;
    
    async function fetchDocument() {
      setIsLoading(true);
      setError(null);
      console.log('Fetching document with ID:', documentId);
      
      try {
        // Get local data for fallback
        const mockData = createLocalMockData();
        
        try {
          // Attempt to fetch from Supabase
          const { data, error } = await supabase
            .from('project_documentation')
            .select('*')
            .eq('id', documentId)
            .single();
            
          if (!error && data) {
            console.log('Successfully loaded document from Supabase:', data);
            
            // Transform the data
            const formattedDoc: ResearchDocument = {
              id: data.id || `doc-${Math.random()}`,
              title: data.title || 'Untitled Document',
              description: data.content ? (data.content.substring(0, 150) + '...') : 'No description available',
              content: data.content || 'Detailed content unavailable',
              category: data.section || 'Uncategorized',
              section: data.section || 'general',
              created_at: data.created_at || new Date().toISOString(),
              updated_at: data.updated_at || new Date().toISOString(),
              tags: data.related_components || [], 
              project_id: data.project_id || projectId || 'default',
              order_index: data.order_index || 999,
              related_components: data.related_components || [],
              isPinned: data.order_index !== null && data.order_index < 3,
            };
            
            setDocument(formattedDoc);
          } else {
            // Fall back to mock data
            console.log('Document not found in Supabase, using mock data');
            const mockDoc = mockData.find(doc => doc.id === documentId);
            
            if (mockDoc) {
              console.log('Found mock document:', mockDoc.title);
              setDocument(mockDoc);
            } else {
              console.error('Document not found in mock data either');
              setError('Document not found');
            }
          }
        } catch (supabaseError) {
          console.error('Supabase error:', supabaseError);
          // Handle Supabase error gracefully
          console.log('Falling back to mock data');
          const mockDoc = mockData.find(doc => doc.id === documentId);
          
          if (mockDoc) {
            console.log('Found mock document:', mockDoc.title);
            setDocument(mockDoc);
          } else {
            console.error('Document not found in mock data either');
            setError('Document not found');
          }
        }
      } catch (err) {
        console.error('Fatal error in fetch logic:', err);
        setError('Failed to load document');
      } finally {
        setIsLoading(false);
      }
    }

    fetchDocument();
  }, [documentId, projectId]);

  // Handle go back
  const handleGoBack = () => {
    navigate(`/projects/${projectId}/market-research`);
  };
  
  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Discard changes
      setEditedDocument({...document});
    }
    setIsEditing(!isEditing);
  };
  
  // Handle saving changes to Supabase
  const saveChanges = async () => {
    if (!editedDocument) return;
    
    setIsSaving(true);
    try {
      // Save to Supabase
      const { error } = await supabase
        .from('project_documentation')
        .update({
          title: editedDocument.title,
          content: editedDocument.content,
          related_components: editedDocument.tags,
          section: editedDocument.category,
        })
        .eq('id', documentId);
      
      if (error) throw error;
      
      // Update the document state
      setDocument(editedDocument);
      setIsEditing(false);
      
      toast({
        title: 'Changes saved successfully!',
        description: 'Document has been updated in the database.',
        variant: 'default',
      });
    } catch (err) {
      console.error('Error saving changes:', err);
      toast({
        title: 'Failed to save changes',
        description: 'Check your connection and try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle adding a new tag
  const addTag = () => {
    if (!newTag.trim() || !editedDocument) return;
    
    setEditedDocument({
      ...editedDocument,
      tags: [...(editedDocument.tags || []), newTag.trim()]
    });
    setNewTag('');
  };
  
  // Handle removing a tag
  const removeTag = (tagToRemove: string) => {
    if (!editedDocument) return;
    
    setEditedDocument({
      ...editedDocument,
      tags: editedDocument.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  // Handle adding a new insight
  const addInsight = () => {
    if (!newInsight.trim() || !editedDocument) return;
    
    setEditedDocument({
      ...editedDocument,
      insights: [...(editedDocument.insights || []), newInsight.trim()]
    });
    setNewInsight('');
  };
  
  // Handle removing an insight
  const removeInsight = (index: number) => {
    if (!editedDocument || !editedDocument.insights) return;
    
    setEditedDocument({
      ...editedDocument,
      insights: editedDocument.insights.filter((_, i) => i !== index)
    });
  };
  
  // Handle adding a new step
  const addStep = () => {
    if (!newStep.trim() || !editedDocument) return;
    
    setEditedDocument({
      ...editedDocument,
      nextSteps: [...(editedDocument.nextSteps || []), newStep.trim()]
    });
    setNewStep('');
  };
  
  // Handle removing a step
  const removeStep = (index: number) => {
    if (!editedDocument || !editedDocument.nextSteps) return;
    
    setEditedDocument({
      ...editedDocument,
      nextSteps: editedDocument.nextSteps.filter((_, i) => i !== index)
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoBack}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Research
        </Button>
        
        <div className="space-y-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
          
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !document) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoBack}
          className="mb-6"
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Research
        </Button>
        
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error || 'Document not found'}
            <Button 
              variant="link" 
              className="text-white p-0 ml-2 underline"
              onClick={handleGoBack}
            >
              Go back to Research
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div ref={contentRef} className="container max-w-5xl mx-auto py-8 px-4 sm:px-6 overflow-y-auto h-full">
      {/* Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}`}>Project</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/projects/${projectId}/market-research`}>Research</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="max-w-[200px] truncate">
              {document.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      
      {/* Navigation and actions */}
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleGoBack}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Research
        </Button>
        
        {isAdmin && (
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={toggleEditMode}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={saveChanges}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleEditMode}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Document
              </Button>
            )}
          </div>
        )}
      </div>
      
      <Card className="p-8 border bg-black/20 shadow-lg overflow-hidden">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start gap-3 mb-4">
            {isEditing ? (
              <Input 
                value={editedDocument?.category || ''} 
                onChange={(e) => setEditedDocument({...editedDocument, category: e.target.value})} 
                className="w-40 text-sm"
              />
            ) : (
              <Badge 
                variant="outline" 
                className={`${categoryColors[document.category] || ''} text-xs`}
              >
                {document.category}
              </Badge>
            )}
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>Updated {new Date(document.updated_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          {isEditing ? (
            <Input 
              value={editedDocument?.title || ''} 
              onChange={(e) => setEditedDocument({...editedDocument, title: e.target.value})} 
              className="text-2xl font-bold mb-4 bg-black/30 border-white/20"
            />
          ) : (
            <h1 className="text-4xl font-bold mb-4">{document.title}</h1>
          )}
          
          <div className="flex flex-wrap gap-2 mb-6">
            {(isEditing ? editedDocument?.tags : document.tags)?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs group flex items-center">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
                {isEditing && (
                  <button 
                    className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            
            {isEditing && (
              <div className="flex items-center gap-2">
                <Input 
                  value={newTag} 
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add tag..."
                  className="w-32 h-6 text-xs"
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6" 
                  onClick={addTag}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-8">
          <div className="prose prose-invert max-w-none bg-black/20 p-6 rounded-lg">
            {isEditing ? (
              <Textarea 
                value={editedDocument?.content || ''} 
                onChange={(e) => setEditedDocument({...editedDocument, content: e.target.value})} 
                className="min-h-[200px] bg-black/30 border-white/20"
              />
            ) : (
              <p className="text-base leading-relaxed whitespace-pre-line">
                {document.content}
              </p>
            )}
          </div>
          
          {/* Insights section */}
          {((isEditing && editedDocument?.insights) || (!isEditing && document.insights && document.insights.length > 0)) && (
            <div className="bg-black/30 rounded-lg p-6 border border-[#FF9800]/20">
              <h4 className="text-lg font-semibold text-[#FF9800] mb-3">Key Insights</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-300">
                {(isEditing ? editedDocument?.insights : document.insights)?.map((insight, idx) => (
                  <li key={idx} className="ml-2 group flex items-center">
                    <span className="flex-1">{insight}</span>
                    {isEditing && (
                      <button 
                        className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeInsight(idx)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              
              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <Input 
                    value={newInsight} 
                    onChange={(e) => setNewInsight(e.target.value)}
                    placeholder="Add new insight..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && addInsight()}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addInsight}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Next Steps section */}
          {((isEditing && editedDocument?.nextSteps) || (!isEditing && document.nextSteps && document.nextSteps.length > 0)) && (
            <div className="bg-black/30 rounded-lg p-6 border border-[#FF9800]/20">
              <h4 className="text-lg font-semibold text-[#FF9800] mb-3">Recommended Actions</h4>
              <ul className="list-disc list-inside space-y-2 text-sm text-neutral-300">
                {(isEditing ? editedDocument?.nextSteps : document.nextSteps)?.map((step, idx) => (
                  <li key={idx} className="ml-2 group flex items-center">
                    <span className="flex-1">{step}</span>
                    {isEditing && (
                      <button 
                        className="ml-2 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeStep(idx)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              
              {isEditing && (
                <div className="mt-4 flex gap-2">
                  <Input 
                    value={newStep} 
                    onChange={(e) => setNewStep(e.target.value)}
                    placeholder="Add new action step..."
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && addStep()}
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addStep}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Code snippet section */}
          {((isEditing && editedDocument?.code_snippet) || (!isEditing && document.code_snippet)) && (
            <div className="bg-black/50 rounded-lg p-6 mt-6 font-mono border border-[#FF9800]/20">
              <h4 className="text-lg font-semibold text-[#FF9800] mb-3">Code Example</h4>
              {isEditing ? (
                <Textarea 
                  value={editedDocument?.code_snippet || ''} 
                  onChange={(e) => setEditedDocument({...editedDocument, code_snippet: e.target.value})} 
                  className="min-h-[150px] font-mono text-sm bg-black/70 rounded-md p-4 border-white/20"
                />
              ) : (
                <pre className="overflow-x-auto whitespace-pre-wrap text-neutral-300 text-sm p-4 bg-black/70 rounded-md">
                  {document.code_snippet}
                </pre>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Add to Calendar
            </Button>
            
            {document.fileUrl && (
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            
            {isAdmin && !isEditing && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={toggleEditMode}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
          </div>
          
          <Button>
            <ExternalLink className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </Card>
    </div>
  );
}
