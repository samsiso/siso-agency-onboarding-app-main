
import { 
  Microscope, 
  Network, 
  Heart, 
  Bot, 
  Globe, 
  ExternalLink 
} from 'lucide-react';

export const sectionIcons = {
  'research': Microscope,
  'integration': Network,
  'medical': Heart,
  'robotics': Bot,
  'international': Globe,
  'default': ExternalLink
};

export const importanceColors = {
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low: 'bg-green-500/10 text-green-500 border-green-500/20'
};

export const subsectionColors = {
  overview: 'from-blue-500/10 via-blue-400/5 to-blue-600/10',
  analysis: 'from-purple-500/10 via-purple-400/5 to-purple-600/10',
  key_details: 'from-orange-500/10 via-orange-400/5 to-orange-600/10',
  implications: 'from-red-500/10 via-red-400/5 to-red-600/10',
  default: 'from-gray-500/10 via-gray-400/5 to-gray-600/10'
};

export const complexityColors = {
  basic: 'bg-green-500/10 text-green-500',
  intermediate: 'bg-yellow-500/10 text-yellow-500',
  advanced: 'bg-red-500/10 text-red-500',
  mixed: 'bg-purple-500/10 text-purple-500'
};
