
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { importanceColors } from "../constants";

interface CardHeaderProps {
  title: string;
  icon: LucideIcon;
  importanceLevel: string;
}

export const CardHeader = ({ title, icon: Icon, importanceLevel }: CardHeaderProps) => {
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
    </div>
  );
};
