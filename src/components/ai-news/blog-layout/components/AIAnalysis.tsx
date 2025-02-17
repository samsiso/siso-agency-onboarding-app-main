
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Brain, RefreshCcw } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AIAnalysisProps {
  analysis: any;
  isLoading: boolean;
}

export const AIAnalysis = ({ analysis, isLoading }: AIAnalysisProps) => {
  return (
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
                  {analysis.key_insights.map((insight: string, i: number) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span>{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/80">Market Impact</h4>
                <p className="text-sm text-white/70">{analysis.market_impact}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/80">Technology Predictions</h4>
                <ul className="space-y-1">
                  {analysis.tech_predictions.map((prediction: string, i: number) => (
                    <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-emerald-400 mt-1">→</span>
                      <span>{prediction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-white/80">Related Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.related_technologies.map((tech: string, i: number) => (
                    <Badge key={i} variant="outline" className="bg-white/5">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-sm text-white/60">Analysis Confidence</span>
                <Badge variant="outline" className={cn(
                  "bg-white/5",
                  analysis.confidence_score >= 0.8 ? "text-green-400" :
                  analysis.confidence_score >= 0.6 ? "text-yellow-400" :
                  "text-red-400"
                )}>
                  {Math.round(analysis.confidence_score * 100)}%
                </Badge>
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
  );
};
