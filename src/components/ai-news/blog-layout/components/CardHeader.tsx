
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";
import { importanceColors } from "../constants";

interface CardHeaderProps {
  title: string;
  icon: LucideIcon;
  importanceLevel: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CardHeader = ({ title, icon: Icon, importanceLevel, isExpanded, onToggle }: CardHeaderProps) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-lg transition-transform duration-300 group-hover:scale-110",
          importanceColors[importanceLevel as keyof typeof importanceColors]
        )}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-siso-orange transition-colors duration-300">
          {title}
        </h3>
      </div>
      <motion.button
        onClick={onToggle}
        animate={{ rotate: isExpanded ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <ChevronDown className="h-5 w-5 text-white/70" />
      </motion.button>
    </div>
  );
};
