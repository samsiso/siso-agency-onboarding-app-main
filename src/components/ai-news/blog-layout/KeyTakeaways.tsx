
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Copy, 
  CheckCircle, 
  Lightbulb, 
  Zap, 
  BookOpen, 
  Award,
  Target,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EnhancedNewsItem } from '@/types/blog';
import { Badge } from '@/components/ui/badge';

// [Analysis] List of icons to use for takeaways to add visual interest
const TAKEAWAY_ICONS = [Lightbulb, Zap, Target, BookOpen, Award, CheckCircle];

interface KeyTakeawaysProps {
  article: EnhancedNewsItem;
}

export const KeyTakeaways = ({ article }: KeyTakeawaysProps) => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // [Analysis] If article doesn't have key_takeaways or it's empty, don't render
  if (!article.key_takeaways || article.key_takeaways.length === 0) {
    return null;
  }

  // [Analysis] Handle copying takeaway to clipboard
  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    
    toast({
      title: "Copied to clipboard",
      description: "The key takeaway has been copied to your clipboard.",
    });
    
    // Reset the copied state after 2 seconds
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };

  return (
    <motion.div
      id="key-takeaways"
      className="mb-10 bg-gradient-to-br from-blue-950/30 to-purple-950/20 border border-blue-500/20 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="p-5 border-b border-blue-500/20 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-blue-500/20 p-2 rounded-full">
            <Lightbulb className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-blue-300">Key Takeaways</h3>
            <p className="text-xs text-blue-400/80">Essential points from this article</p>
          </div>
        </div>
        
        <Badge className="bg-blue-900/30 text-blue-300 border-blue-500/30">
          {article.key_takeaways.length} points
        </Badge>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0 text-blue-400"
        >
          {isCollapsed ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
          {article.key_takeaways.map((takeaway, index) => {
            // [Analysis] Select an icon based on the index, cycling through available icons
            const TakeawayIcon = TAKEAWAY_ICONS[index % TAKEAWAY_ICONS.length];
            
            return (
              <motion.div
                key={index}
                className="flex items-start gap-3 group/item bg-blue-900/10 p-4 rounded-md border border-blue-800/20 hover:border-blue-700/30 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-blue-500/10 p-1.5 rounded-full mt-0.5">
                  <TakeawayIcon className="h-4 w-4 text-blue-400" />
                </div>
                
                <div className="flex-grow">
                  <div className="text-gray-200">{takeaway}</div>
                  
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs opacity-0 group-hover/item:opacity-100 transition-opacity"
                      onClick={() => handleCopy(takeaway, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1.5 text-green-400" />
                          <span className="text-green-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};
