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
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const [formattedSections, setFormattedSections] = useState<any>({});
  const [isCreating, setIsCreating] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState('');
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

  const handleCreatePlan = async () => {
    if (!title.trim() || !rawContent.trim()) {
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
      // const newPlan = await planTemplatesApi.create({
      //   title,
      //   raw_content: rawContent,
      //   status: 'active'
      // });
      
      // Mock plan creation for now
      const mockSlug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim('-');
      
      const url = `${window.location.origin}/plan/${mockSlug}`;
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
    setFormattedSections({});
    setGeneratedUrl('');
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
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
          // Creation form
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger value="create" className="text-white data-[state=active]:bg-gray-700">
                Create Plan
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-white data-[state=active]:bg-gray-700">
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">Plan Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., E-commerce App Development Plan"
                    className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-white">Paste ChatGPT/AI Content</Label>
                    <Button 
                      onClick={handleAutoFormat}
                      variant="outline"
                      size="sm"
                      disabled={!rawContent.trim()}
                    >
                      <Wand2 className="mr-2 w-4 h-4" />
                      Auto-Format
                    </Button>
                  </div>
                  <Textarea
                    value={rawContent}
                    onChange={(e) => setRawContent(e.target.value)}
                    placeholder="Paste your ChatGPT content here...

The system will auto-detect:
• Project Overview sections
• Feature lists
• Timeline/phases  
• Pricing information
• Next steps/contact info"
                    className="h-64 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Tip: Include sections like "Project Overview", "Features", "Timeline", etc. for best auto-formatting
                  </p>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    onClick={() => onOpenChange(false)} 
                    variant="ghost"
                    className="text-gray-400"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleCreatePlan}
                    disabled={isCreating || !title.trim() || !rawContent.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Save className="mr-2 w-4 h-4" />
                    {isCreating ? 'Creating...' : 'Create & Generate URL'}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6 mt-6">
              {Object.keys(formattedSections).length === 0 ? (
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardContent className="py-12 text-center">
                    <Wand2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-white font-medium mb-2">No formatted content yet</h3>
                    <p className="text-gray-400 mb-4">
                      Add content and click "Auto-Format" to see the preview
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">{title || 'Your App Plan'}</h2>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">
                      Preview Mode
                    </Badge>
                  </div>
                  
                  {Object.entries(formattedSections).map(([sectionKey, content]) => (
                    <Card key={sectionKey} className="border-gray-700 bg-gray-800/50">
                      <CardHeader>
                        <CardTitle className="text-white">
                          {sectionTitles[sectionKey] || sectionKey}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-gray-300 whitespace-pre-wrap">
                          {content as string}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
} 