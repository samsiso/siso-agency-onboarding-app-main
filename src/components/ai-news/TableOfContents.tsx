
import { NewsItem } from '@/types/blog';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface TableOfContentsProps {
  items: NewsItem[];
  activeId?: string;
}

export const TableOfContents = ({ items, activeId }: TableOfContentsProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-24">
      <h3 className="text-md font-medium mb-4">Table of Contents</h3>
      <div className="space-y-1">
        {items.map((item, index) => {
          const isActive = activeId === item.id;
          
          return (
            <motion.a
              key={item.id}
              href={`#${item.id}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                block py-2 px-3 text-sm rounded-md
                transition-colors duration-200
                ${isActive 
                  ? 'bg-siso-red/10 text-siso-red font-medium' 
                  : 'hover:bg-muted hover:text-foreground text-muted-foreground'
                }
              `}
            >
              <div className="flex flex-col">
                <span className="line-clamp-1">{item.title}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(item.date), 'MMM d, yyyy')}
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
};
