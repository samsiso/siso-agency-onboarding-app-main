
import { 
  Beaker, 
  Globe, 
  Microscope, 
  Bot, 
  Command, 
  Layers,
  Network,
  LucideIcon
} from 'lucide-react';

export const importanceColors = {
  high: "bg-green-500/20 text-green-400",
  medium: "bg-blue-500/20 text-blue-400",
  low: "bg-gray-500/20 text-gray-400",
  critical: "bg-red-500/20 text-red-400",
};

// [Analysis] Added subsectionColors for different article subsection styling
export const subsectionColors = {
  research: "from-blue-900/20 to-blue-950/50",
  integration: "from-purple-900/20 to-purple-950/50",
  medical: "from-green-900/20 to-green-950/50",
  robotics: "from-amber-900/20 to-amber-950/50", 
  international: "from-indigo-900/20 to-indigo-950/50",
  default: "from-gray-900/20 to-gray-950/50"
};

// [Analysis] Added section-specific icons for better visual categorization
export const sectionIcons: Record<string, LucideIcon> = {
  research: Microscope,
  integration: Command,
  medical: Beaker,
  robotics: Bot,
  international: Globe,
  default: Layers,
  network: Network
};

// [Analysis] Added complexity-based colors for visual distinction
export const complexityColors = {
  beginner: "bg-green-500/10 text-green-500 border-none",
  intermediate: "bg-blue-500/10 text-blue-500 border-none",
  advanced: "bg-purple-500/10 text-purple-500 border-none",
  expert: "bg-amber-500/10 text-amber-500 border-none",
  technical: "bg-red-500/10 text-red-500 border-none"
};
