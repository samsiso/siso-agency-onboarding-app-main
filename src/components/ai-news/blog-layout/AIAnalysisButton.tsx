
import { Brain } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RainbowButton } from '@/components/ui/rainbow-button';
import { EnhancedNewsItem } from '@/types/blog';

// [Analysis] This component handles the generation of AI analysis for articles
// [Plan] In the future, we can add more granular control over what aspects to analyze

interface AIAnalysisButtonProps {
  article: EnhancedNewsItem;
  onAnalyze: () => Promise<void>;
  isGenerating?: boolean;
}

export const AIAnalysisButton = ({ 
  article, 
  onAnalyze,
  isGenerating = false 
}: AIAnalysisButtonProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      await onAnalyze();
    } catch (error) {
      console.error('Error generating AI analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-2 p-4 bg-blue-950/20 rounded-lg border border-blue-500/20">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <Brain className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-blue-300">AI Analysis</h3>
            <p className="text-xs text-blue-400/80">
              Generate enhanced insights for this article
            </p>
          </div>
        </div>
        
        <RainbowButton
          onClick={handleAnalyze}
          disabled={loading || isGenerating}
          className="w-full mt-2"
        >
          {loading || isGenerating ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Analysis...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Generate AI Analysis
            </div>
          )}
        </RainbowButton>
      </div>
    </div>
  );
};
