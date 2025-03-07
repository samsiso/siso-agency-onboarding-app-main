
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Brain, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AIAnalysisDialog } from "../../AIAnalysisDialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AIAnalysisProps {
  analysis: any;
  isLoading: boolean;
  articleTitle?: string;
  articleId?: string;
}

// [Analysis] Updated to include popup dialog for more detailed viewing
export const AIAnalysis = ({ analysis, isLoading, articleTitle, articleId }: AIAnalysisProps) => {
  const [showDialog, setShowDialog] = useState(false);
  
  return (
    <>
      <Accordion type="single" collapsible className="w-full border-t border-white/10 pt-4">
        <AccordionItem value="analysis" className="border-none">
          <AccordionTrigger className="text-sm font-medium text-white hover:no-underline">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-400" />
              AI Analysis
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <RefreshCcw className="w-5 h-5 text-white/50 animate-spin" />
              </div>
            ) : analysis ? (
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white/80">Key Insights</h4>
                  <ul className="space-y-1">
                    {analysis.key_insights?.slice(0, 2).map((insight: string, i: number) => (
                      <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                        <span className="text-blue-400 mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                  {analysis.key_insights?.length > 2 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-950/20 p-0 h-auto"
                      onClick={() => setShowDialog(true)}
                    >
                      Show more insights...
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-white/60">Confidence</span>
                  <Badge variant="outline" className={cn(
                    "bg-white/5",
                    analysis.confidence_score >= 0.8 ? "text-green-400" :
                    analysis.confidence_score >= 0.6 ? "text-yellow-400" :
                    "text-red-400"
                  )}>
                    {Math.round((analysis.confidence_score || 0.7) * 100)}%
                  </Badge>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDialog(true)}
                    className="w-full justify-center bg-blue-950/20 border-blue-900 hover:bg-blue-900/20 text-blue-400"
                  >
                    View Full Analysis
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4 text-sm text-white/60 text-center">
                No analysis available
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      {/* Full Analysis Dialog */}
      <AIAnalysisDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        analysis={analysis}
        isLoading={isLoading}
        articleTitle={articleTitle}
        articleId={articleId}
      />
    </>
  );
};
