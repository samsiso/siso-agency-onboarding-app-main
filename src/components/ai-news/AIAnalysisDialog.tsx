
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, TrendingUp, Code2, Lightbulb, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newsId: string;
}

interface AnalysisStage {
  icon: React.ReactNode;
  text: string;
}

const stages: AnalysisStage[] = [
  { icon: <Brain className="w-5 h-5" />, text: "Extracting key insights..." },
  { icon: <TrendingUp className="w-5 h-5" />, text: "Evaluating market impact..." },
  { icon: <Code2 className="w-5 h-5" />, text: "Identifying tech trends..." },
  { icon: <Lightbulb className="w-5 h-5" />, text: "Generating recommendations..." },
];

export const AIAnalysisDialog = ({ open, onOpenChange, newsId }: AIAnalysisDialogProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const runAnalysis = async () => {
    try {
      setError(null);
      setAnalysis(null);
      setCurrentStage(0);

      // Start stage animation sequence
      const stageInterval = setInterval(() => {
        setCurrentStage(prev => (prev < stages.length - 1 ? prev + 1 : prev));
      }, 2000);

      const { data: existingAnalysis } = await supabase
        .from('news_ai_analysis')
        .select('*')
        .eq('news_id', newsId)
        .maybeSingle();

      if (existingAnalysis) {
        clearInterval(stageInterval);
        setAnalysis(existingAnalysis);
        return;
      }

      const response = await supabase.functions.invoke('analyze-news', {
        body: { newsId },
      });

      clearInterval(stageInterval);
      
      if (response.error) {
        throw new Error(response.error.message);
      }

      setAnalysis(response.data);
    } catch (err) {
      setError(err.message);
      toast({
        title: "Analysis Failed",
        description: "Unable to complete the analysis. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] relative overflow-hidden">
        {/* Background pattern */}
        <div 
          className="absolute inset-0 -z-10"
          style={{
            backgroundImage: "url('/lovable-uploads/d08f5142-c0ad-4700-bd7a-c035da96ec0b.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15
          }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm -z-10" />

        <DialogHeader>
          <DialogTitle className="text-siso-text-bold">AI Analysis</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {!analysis && !error ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {stages.map((stage, index) => (
                  <motion.div
                    key={index}
                    className={`flex items-center space-x-3 ${
                      index === currentStage ? 'text-siso-red' : 'text-gray-400'
                    }`}
                    animate={{
                      scale: index === currentStage ? 1.05 : 1,
                      opacity: index <= currentStage ? 1 : 0.5,
                    }}
                  >
                    <div className={`p-2 rounded-full ${
                      index === currentStage ? 'bg-siso-red/10' : 'bg-gray-100'
                    }`}>
                      {stage.icon}
                    </div>
                    <span>{stage.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center space-y-4"
              >
                <X className="w-12 h-12 text-red-500 mx-auto" />
                <p className="text-red-500">{error}</p>
                <button
                  onClick={runAnalysis}
                  className="px-4 py-2 bg-siso-red text-white rounded-md hover:bg-siso-red/90 transition-colors"
                >
                  Retry Analysis
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="font-semibold text-siso-text-bold">Key Insights</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {analysis.key_insights.map((insight: string, index: number) => (
                      <li key={index} className="text-siso-text">{insight}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-siso-text-bold">Market Impact</h3>
                  <p className="mt-2 text-siso-text">{analysis.market_impact}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-siso-text-bold">Tech Predictions</h3>
                  <ul className="mt-2 list-disc pl-5 space-y-2">
                    {analysis.tech_predictions.map((prediction: string, index: number) => (
                      <li key={index} className="text-siso-text">{prediction}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-siso-text-bold">Related Technologies</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {analysis.related_technologies.map((tech: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-siso-red/10 text-siso-red rounded-full text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-siso-text-bold">Business Implications</h3>
                  <p className="mt-2 text-siso-text">{analysis.business_implications}</p>
                </div>

                <div className="flex items-center justify-between text-sm text-siso-text/70">
                  <span>Confidence Score</span>
                  <span>{(analysis.confidence_score * 100).toFixed(1)}%</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};
