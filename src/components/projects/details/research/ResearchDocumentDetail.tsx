import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Tag, Download, ExternalLink, ChevronLeft, Edit, Save, X, Plus, Link2, FileText, BookOpen } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

// Simplified ResearchDocument interface
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
  isPinned?: boolean;
  project_id: string;
}

export function ResearchDocumentDetail() {
  const { projectId, documentId } = useParams<{ projectId: string; documentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [isAdmin, setIsAdmin] = useState(true);
  const [isEditing, setIsEditing] = useState(documentId === 'new');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Document state
  const [document, setDocument] = useState<ResearchDocument | null>(null);
  const [editedDocument, setEditedDocument] = useState<ResearchDocument | null>(null);
  
  // New document state
  const [newTag, setNewTag] = useState('');
  
  // Initialize document if creating new
  useEffect(() => {
    if (documentId === 'new') {
      const newDoc: ResearchDocument = {
        id: 'new',
        title: 'New Research Document',
        description: 'Paste detailed research content here',
        content: '',
        category: 'Research',
        section: 'Research',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tags: ['research', 'documentation'],
        isPinned: false,
        project_id: projectId || 'default'
      };
      setDocument(newDoc);
      setEditedDocument(newDoc);
      setIsLoading(false);
    }
  }, [documentId, projectId]);
  
  // Fetch existing document
  useEffect(() => {
    if (documentId && documentId !== 'new') {
      fetchDocument();
    }
  }, [documentId]);
  
  // Reset edited document when document changes
  useEffect(() => {
    if (document && documentId !== 'new') {
      setEditedDocument({...document});
    }
  }, [document]);
  
  // Fetch the document data
  const fetchDocument = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Attempt to fetch from research_documents table
      const { data, error } = await supabase
        .from('research_documents')
        .select('*')
        .eq('id', documentId)
        .single();
        
      if (!error && data) {
        console.log('Successfully loaded document from Supabase:', data);
        
        // Transform the data
        const formattedDoc: ResearchDocument = {
          id: data.id,
          title: data.title || 'Untitled Document',
          description: data.description || 'No description available',
          content: data.content || data.description || '',
          category: data.category || 'Research',
          section: data.category || 'Research',
          created_at: data.created_at || new Date().toISOString(),
          updated_at: data.updated_at || new Date().toISOString(),
          tags: Array.isArray(data.tags) ? data.tags : [],
          isPinned: data.is_pinned || false,
          project_id: data.project_id || projectId || 'default'
        };
        
        setDocument(formattedDoc);
      } else {
        throw new Error('Document not found');
      }
    } catch (err) {
      console.error('Error fetching document:', err);
      setError('Failed to load document');
    } finally {
      setIsLoading(false);
    }
  };

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
  
  // Save changes to the document
  const saveChanges = async () => {
    if (!editedDocument) return;
    
    setIsSaving(true);
    
    try {
      // Prepare the document data
      const documentData = {
        title: editedDocument.title,
        description: editedDocument.description?.substring(0, 150) + '...',
        content: editedDocument.content,
        category: editedDocument.category,
        tags: editedDocument.tags,
        is_pinned: editedDocument.isPinned,
        project_id: projectId,
        updated_at: new Date().toISOString(),
      };
      
      if (documentId === 'new') {
        // Create new document
        const { data, error } = await supabase
          .from('research_documents')
          .insert(documentData)
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        
        toast({
          title: "Document Created",
          description: "Your research document has been saved successfully.",
        });
        
        // Navigate to the new document
        navigate(`/projects/${projectId}/market-research/${data.id}`, { replace: true });
      } else {
        // Update existing document
        const { data, error } = await supabase
          .from('research_documents')
          .update(documentData)
          .eq('id', documentId)
          .select()
          .single();
          
        if (error) throw new Error(error.message);
        
        toast({
          title: "Document Updated",
          description: "Changes have been saved successfully.",
        });
        
        // Update the document with response data
        const updatedDoc: ResearchDocument = {
          ...editedDocument,
          updated_at: data?.updated_at || new Date().toISOString(),
        };
        
        setDocument(updatedDoc);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving document:', err);
      toast({
        title: "Error",
        description: `Failed to save document: ${err instanceof Error ? err.message : 'Unknown error'}`,
        variant: "destructive"
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
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || (!document && documentId !== 'new')) {
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
    <div className="container max-w-5xl mx-auto py-8 px-4 sm:px-6 overflow-y-auto">
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
              {documentId === 'new' ? 'New Research Document' : (document?.title || '')}
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
                {documentId !== 'new' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleEditMode}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                )}
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={saveChanges}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : (documentId === 'new' ? 'Create Document' : 'Save Changes')}
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
      
      <Card className="border bg-black/20 shadow-lg overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            {isEditing ? (
              <Input 
                value={editedDocument?.title || ''} 
                onChange={(e) => setEditedDocument({...editedDocument, title: e.target.value})} 
                className="text-2xl font-bold bg-black/30 border-white/20"
                placeholder="Enter document title..."
              />
            ) : (
              <h1 className="text-3xl font-bold">{document?.title}</h1>
            )}
          </div>
          
          {/* Tags */}
          <div>
            <div className="text-sm text-muted-foreground mb-2">Tags</div>
            <div className="flex flex-wrap gap-2 mb-6">
              {(isEditing ? editedDocument?.tags : document?.tags)?.map((tag) => (
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
                    className="w-32 h-8 text-xs"
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={addTag}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-black/20 rounded-lg overflow-hidden">
            <div className="p-4 flex items-center bg-black/40">
              <FileText className="h-5 w-5 mr-2 text-blue-400" />
              <span className="font-medium">Research Content</span>
            </div>
            
            <div className="p-6">
              {isEditing ? (
                <Textarea 
                  value={editedDocument?.content || ''} 
                  onChange={(e) => setEditedDocument({...editedDocument, content: e.target.value})} 
                  className="min-h-[600px] bg-black/20 border-white/20 font-mono text-sm"
                  placeholder="Paste your research document text here. Markdown formatting is supported."
                />
              ) : (
                <div className="prose prose-invert max-w-none prose-pre:bg-black/30 prose-pre:p-4 prose-pre:rounded prose-headings:text-white prose-a:text-blue-400">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} 
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                  >
                    {document?.content || ''}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          </div>
          
          {/* Metadata */}
          <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-400 mt-4 pt-4 border-t border-white/10">
            <div>
              Created: {new Date(document?.created_at || '').toLocaleString()}
            </div>
            <div>
              Last updated: {new Date(document?.updated_at || '').toLocaleString()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
