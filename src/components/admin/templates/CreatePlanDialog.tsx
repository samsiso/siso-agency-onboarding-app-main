import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wand2, 
  Eye, 
  Save, 
  Copy, 
  Sparkles, 
  FileText, 
  Share2,
  AlertCircle,
  Type
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { NotionEditor } from '@/components/notion-editor/NotionEditor';
import { NotionRenderer } from '@/components/notion-editor/NotionRenderer';
import { NotionBlock } from '@/types/notion';

interface CreatePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Auto-formatting preview patterns (simplified version)
const detectSections = (content: string) => {
  const lines = content.split('\n').filter(line => line.trim());
  const sections: any = {};
  
  let currentSection = 'overview';
  let currentContent: string[] = [];
  
  const sectionPatterns = {
    overview: /(?:project\s+overview|overview|summary)/i,
    features: /(?:features|key\s+features|functionality)/i,
    timeline: /(?:timeline|phases|schedule|milestones)/i,
    pricing: /(?:pricing|cost|investment|budget)/i,
    contact: /(?:contact|next\s+steps|get\s+started)/i
  };
  
  const detectSection = (line: string): string | null => {
    const lowerLine = line.toLowerCase();
    for (const [sectionKey, pattern] of Object.entries(sectionPatterns)) {
      if (pattern.test(lowerLine)) {
        return sectionKey;
      }
    }
    return null;
  };
  
  lines.forEach((line) => {
    const detectedSection = detectSection(line);
    
    if (detectedSection) {
      // Save previous section
      if (currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      
      // Start new section
      currentSection = detectedSection;
      currentContent = [];
    } else {
      currentContent.push(line);
    }
  });
  
  // Process final section
  if (currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }
  
  return sections;
};

export function CreatePlanDialog({ open, onOpenChange }: CreatePlanDialogProps) {
  const [title, setTitle] = useState('');
  const [rawContent, setRawContent] = useState('');
  const [formattedContent, setFormattedContent] = useState('');
  const [contentBlocks, setContentBlocks] = useState<NotionBlock[]>([]);
  const [formattedSections, setFormattedSections] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [editMode, setEditMode] = useState<'raw' | 'notion'>('raw');
  const { toast } = useToast();

  const handleAutoFormat = () => {
    if (!rawContent.trim()) {
      toast({
        variant: "destructive",
        title: "No content to format",
        description: "Please paste some content first.",
      });
      return;
    }

    const sections = detectSections(rawContent);
    setFormattedSections(sections);
    
    toast({
      title: "Content auto-formatted!",
      description: `Detected ${Object.keys(sections).length} sections`,
    });
  };

  // Handle NotionEditor changes
  const handleNotionChange = (markdown: string, blocks: NotionBlock[]) => {
    setFormattedContent(markdown);
    setContentBlocks(blocks);
  };

  const handleCreatePlan = async () => {
    const contentToSave = editMode === 'notion' ? formattedContent : rawContent;
    
    if (!title.trim() || !contentToSave.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please provide both a title and content.",
      });
      return;
    }

    setIsCreating(true);
    
    try {
      // TODO: Replace with actual API call when database is ready
      // Save both the raw content and the notion blocks if available
      const planData = {
        title,
        raw_content: contentToSave,
        notion_blocks: editMode === 'notion' ? contentBlocks : null,
        status: 'active'
      };
      
      // Mock plan creation for now
      const mockSlug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
      const url = `${window.location.origin}/plan/share/${mockSlug}`;
      setGeneratedUrl(url);
      
      toast({
        title: "Plan created successfully!",
        description: "Your shareable plan is ready.",
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error creating plan",
        description: "Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyUrl = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(generatedUrl);
      toast({
        title: "URL copied!",
        description: "Share this link with your client.",
      });
    }
  };

  const resetForm = () => {
    setTitle('');
    setRawContent('');
    setFormattedContent('');
    setContentBlocks([]);
    setFormattedSections({});
    setGeneratedUrl('');
    setEditMode('raw');
  };

  const sectionIcons = {
    overview: FileText,
    features: Sparkles,
    timeline: AlertCircle,
    pricing: '$',
    contact: Share2
  };

  const sectionTitles = {
    overview: '📋 Project Overview',
    features: '✨ Key Features',
    timeline: '📅 Timeline & Phases',
    pricing: '💰 Investment',
    contact: '📞 Next Steps'
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Wand2 className="mr-2 h-5 w-5 text-purple-400" />
            Create Shareable App Plan
          </DialogTitle>
        </DialogHeader>

        {generatedUrl ? (
          // Success state - show generated URL
          <div className="space-y-6">
            <Card className="border-green-500/20 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-green-400 flex items-center">
                  <Share2 className="mr-2 h-5 w-5" />
                  Plan Created Successfully!
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white">Shareable URL:</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Input 
                      value={generatedUrl} 
                      readOnly 
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button onClick={copyUrl} variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    onClick={() => window.open(generatedUrl, '_blank')}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Eye className="mr-2 w-4 h-4" />
                    Preview Plan
                  </Button>
                  <Button 
                    onClick={() => {
                      resetForm();
                      onOpenChange(false);
                    }} 
                    variant="outline"
                  >
                    Close
                  </Button>
                  <Button 
                    onClick={resetForm} 
                    variant="ghost"
                  >
                    Create Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Form state - create new plan
          <Tabs defaultValue="input" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="input" className="text-white data-[state=active]:bg-purple-600">
                Input Content
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-white data-[state=active]:bg-purple-600">
                Preview
              </TabsTrigger>
              <TabsTrigger value="sections" className="text-white data-[state=active]:bg-purple-600">
                Formatted Sections
              </TabsTrigger>
            </TabsList>

            <TabsContent value="input" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-white">Plan Title</Label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., E-commerce App Development Plan"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white">Content</Label>
                    <div className="flex items-center space-x-2">
                      <Button
                        type="button"
                        variant={editMode === 'raw' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setEditMode('raw')}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Raw Text
                      </Button>
                      <Button
                        type="button"
                        variant={editMode === 'notion' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setEditMode('notion')}
                      >
                        <Type className="w-4 h-4 mr-2" />
                        Rich Editor
                      </Button>
                    </div>
                  </div>

                  {editMode === 'raw' ? (
                    <Textarea
                      value={rawContent}
                      onChange={(e) => setRawContent(e.target.value)}
                      placeholder="Paste your ChatGPT content here..."
                      className="h-96 bg-gray-800 border-gray-700 text-white resize-none"
                    />
                  ) : (
                    <NotionEditor
                      initialContent={rawContent}
                      onChange={handleNotionChange}
                      placeholder="Start typing your plan content..."
                      className="min-h-96"
                    />
                  )}
                </div>

                <div className="flex items-center space-x-4">
                  {editMode === 'raw' && (
                    <Button
                      type="button"
                      onClick={handleAutoFormat}
                      variant="outline"
                      className="text-white border-gray-600 hover:bg-gray-800"
                    >
                      <Wand2 className="mr-2 h-4 w-4" />
                      Auto-Format Sections
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleCreatePlan}
                    disabled={isCreating || !title.trim() || (!rawContent.trim() && !formattedContent.trim())}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Plan
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">{title || 'Plan Preview'}</h3>
                {editMode === 'notion' && formattedContent ? (
                  <NotionRenderer content={formattedContent} />
                ) : rawContent ? (
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {rawContent}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">No content to preview</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="sections" className="space-y-4">
              {Object.keys(formattedSections).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(formattedSections).map(([sectionKey, content]) => {
                    const Icon = sectionIcons[sectionKey] || FileText;
                    
                    return (
                      <Card key={sectionKey} className="border-gray-700 bg-gray-800/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center text-white text-lg">
                            <Icon className="mr-2 h-5 w-5 text-purple-400" />
                            {sectionTitles[sectionKey] || sectionKey}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                            {content as string}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400">No sections detected yet</p>
                  <p className="text-gray-500 text-sm">Use the "Auto-Format Sections" button to analyze your content</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
} 