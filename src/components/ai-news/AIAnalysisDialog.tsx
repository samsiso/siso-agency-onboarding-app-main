
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Share2, Bookmark, Download, Brain } from 'lucide-react';
import { useBlogPostActions } from '@/hooks/useBlogPostActions';

export interface AIAnalysisDialogProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: any;
  isLoading: boolean;
  articleTitle?: string;
  articleDescription?: string;
  articleId: string;
}

export const AIAnalysisDialog: React.FC<AIAnalysisDialogProps> = ({
  isOpen,
  onClose,
  analysis,
  isLoading,
  articleTitle = "Article",
  articleDescription = "",
  articleId
}) => {
  const { handleShare, handleBookmark } = useBlogPostActions();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gray-950 border-gray-800 text-white overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Analysis: {articleTitle}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Detailed AI-powered analysis of this article and its implications
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => handleShare(articleTitle, articleDescription)}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => handleBookmark(articleId)}
          >
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmark
          </Button>
        </div>

        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-400">Analyzing article content...</p>
          </div>
        ) : analysis ? (
          <Tabs defaultValue="market" className="w-full">
            <TabsList className="grid grid-cols-4 bg-gray-900/50 border border-gray-800 rounded-md p-1">
              <TabsTrigger value="market" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Market Impact
              </TabsTrigger>
              <TabsTrigger value="technical" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Technical
              </TabsTrigger>
              <TabsTrigger value="related" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Related Tech
              </TabsTrigger>
              <TabsTrigger value="business" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
                Business
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="market" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Market Impact Analysis</h3>
              <p className="text-gray-300">{analysis?.market_impact || "No market impact analysis available"}</p>
            </TabsContent>
            
            <TabsContent value="technical" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Technical Predictions</h3>
              {analysis?.technical_predictions && analysis.technical_predictions.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-300">
                  {analysis.technical_predictions.map((prediction: string, index: number) => (
                    <li key={index}>{prediction}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-300">No technical predictions available</p>
              )}
            </TabsContent>
            
            <TabsContent value="related" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Related Technologies</h3>
              {analysis?.related_technologies && analysis.related_technologies.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {analysis.related_technologies.map((tech: string, index: number) => (
                    <span key={index} className="bg-gray-800 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-300">No related technologies identified</p>
              )}
            </TabsContent>
            
            <TabsContent value="business" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
              <h3 className="text-lg font-medium mb-2 text-blue-300">Business Implications</h3>
              <p className="text-gray-300">{analysis?.business_implications || "No business implications analysis available"}</p>
            </TabsContent>
          </Tabs>
        ) : (
          <div className="p-6 text-center text-gray-400 bg-gray-900/30 rounded-md">
            <Brain className="h-10 w-10 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">No Analysis Available</h3>
            <p>This article hasn't been analyzed by our AI system yet.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
