
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Copy, TrendingUp } from "lucide-react";

interface KeyDetailsProps {
  details: string[];
  onCopy: (text: string) => void;
}

export const KeyDetails = ({ details, onCopy }: KeyDetailsProps) => {
  if (!details?.length) return null;

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3">
        <TrendingUp className="h-5 w-5 text-emerald-400" />
        <span className="text-base font-semibold text-emerald-400">Key Details</span>
      </div>
      <ul className="space-y-3">
        {details.map((detail, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-start gap-3 text-lg text-gray-200 group/item"
          >
            <span className="text-emerald-400 mt-1.5">•</span>
            <span className="leading-relaxed flex-1">{detail}</span>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover/item:opacity-100 transition-opacity"
              onClick={() => onCopy(detail)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};
