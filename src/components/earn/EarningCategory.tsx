import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EarningTask {
  action: string;
  points: string;
}

interface EarningCategoryProps {
  title: string;
  description: string;
  icon: LucideIcon;
  items: EarningTask[];
  isSelected?: boolean;
  onClick?: () => void;
}

export const EarningCategory = ({
  title,
  description,
  icon: Icon,
  items,
  isSelected,
  onClick
}: EarningCategoryProps) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg transition-all duration-300",
        "hover:bg-siso-text/5 group",
        isSelected && "bg-siso-text/10"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center",
          "bg-gradient-to-br from-siso-red/10 to-siso-orange/10",
          "group-hover:from-siso-red/20 group-hover:to-siso-orange/20",
          "transition-all duration-300"
        )}>
          <Icon className="w-5 h-5 text-siso-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-siso-text-bold truncate">{title}</h3>
          <p className="text-sm text-siso-text/70 truncate">{description}</p>
        </div>
      </div>
    </button>
  );
};