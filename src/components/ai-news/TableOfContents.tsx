
import { useAutoScroll } from '@/hooks/use-auto-scroll';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { ChevronRight, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface TableOfContentsProps {
  items: Array<{
    id: string;
    title: string;
    date: string;
    impact?: string;
  }>;
  activeId?: string;
}

export const TableOfContents = ({ items, activeId }: TableOfContentsProps) => {
  // [Analysis] Using our existing useAutoScroll hook for smooth scrolling
  const { scrollRef, scrollToBottom } = useAutoScroll();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImpactColor = (impact: string = 'medium') => {
    switch (impact.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-siso-red/10 text-siso-red border-siso-red/20';
    }
  };

  return (
    <div className="relative w-full">
      <div className="sticky top-4 w-full">
        <div className="bg-siso-text/5 rounded-lg border border-siso-text/10 p-4">
          <h3 className="text-lg font-semibold mb-4 text-siso-text-bold">Today's Updates</h3>
          <ScrollArea className="h-[calc(100vh-200px)]" ref={scrollRef}>
            <div className="space-y-2">
              {items.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200
                    ${activeId === item.id 
                      ? 'bg-siso-text/10 shadow-sm' 
                      : 'hover:bg-siso-text/5'
                    }`}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-siso-text/90 line-clamp-2 group-hover:text-siso-text">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-siso-text/60">
                          {formatDistanceToNow(new Date(item.date), { addSuffix: true })}
                        </span>
                        {item.impact && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${getImpactColor(item.impact)}`}>
                            {item.impact} Impact
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`w-4 h-4 mt-1 transition-colors
                      ${activeId === item.id 
                        ? 'text-siso-orange' 
                        : 'text-siso-text/40'
                      }`} 
                    />
                  </div>
                </motion.button>
              ))}
            </div>
          </ScrollArea>
          
          <Button
            variant="outline"
            size="sm"
            onClick={scrollToTop}
            className="w-full mt-4 gap-2"
          >
            <ArrowUp className="w-4 h-4" />
            Back to Top
          </Button>
        </div>
      </div>
    </div>
  );
};
