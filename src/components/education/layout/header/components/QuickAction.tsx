
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface QuickActionProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export const QuickAction = ({ icon: Icon, label, onClick, disabled }: QuickActionProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-siso-bg-alt/50 hover:bg-siso-bg-alt"
        onClick={onClick}
        disabled={disabled}
      >
        <Icon className="h-4 w-4 text-siso-orange" />
        <span className="text-xs">{label}</span>
      </Button>
    </motion.div>
  );
};
