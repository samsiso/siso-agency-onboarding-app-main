
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
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EnhancedNewsItem } from '@/types/blog';

// [Analysis] List of icons to use for takeaways to add visual interest
const TAKEAWAY_ICONS = [Lightbulb, Zap, Target, BookOpen, Award, CheckCircle];

interface KeyTakeawaysProps {
  article: EnhancedNewsItem;
}

export const KeyTakeaways = ({ article }: KeyTakeawaysProps) => {
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
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
      className="mb-8 bg-blue-950/20 border border-blue-500/20 rounded-lg p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="text-xl font-semibold mb-4 text-blue-400 flex items-center gap-2">
        <Lightbulb className="h-5 w-5" />
        Key Takeaways
      </h3>
      
      <div className="space-y-4">
        {article.key_takeaways.map((takeaway, index) => {
          // [Analysis] Select an icon based on the index, cycling through available icons
          const TakeawayIcon = TAKEAWAY_ICONS[index % TAKEAWAY_ICONS.length];
          
          return (
            <motion.div
              key={index}
              className="flex items-start gap-3 group/item bg-blue-900/10 p-3 rounded-md border border-blue-800/20"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="text-blue-400 mt-1 flex-shrink-0">
                <TakeawayIcon className="h-5 w-5" />
              </span>
              
              <span className="text-gray-200 flex-grow">{takeaway}</span>
              
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0"
                onClick={() => handleCopy(takeaway, index)}
              >
                {copiedIndex === index ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
