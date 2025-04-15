
import { PortfolioItem } from '@/types/portfolio';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PortfolioCardProps {
  item: PortfolioItem;
  onSelect: () => void;
}

export const PortfolioCard = ({ item, onSelect }: PortfolioCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col">
        {item.image_url ? (
          <div 
            className="w-full h-48 bg-cover bg-center transition-transform duration-300 hover:scale-105"
            style={{ backgroundImage: `url(${item.image_url})` }}
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-siso-red/20 to-siso-orange/20 flex items-center justify-center">
            <span className="text-siso-text/50">No image available</span>
          </div>
        )}
        
        <CardHeader>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold">{item.title}</h3>
            {item.completion_date && (
              <span className="text-xs text-siso-text/60 bg-siso-text/5 px-2 py-1 rounded-full">
                {new Date(item.completion_date).toLocaleDateString(undefined, { year: 'numeric', month: 'short' })}
              </span>
            )}
          </div>
          {item.description && (
            <p className="text-muted-foreground">{item.description}</p>
          )}
        </CardHeader>

        <CardContent className="flex-grow">
          {item.technologies?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.technologies.map((tech) => (
                <span 
                  key={tech}
                  className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}

          {item.highlights?.length > 0 && (
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {item.highlights.slice(0, 2).map((highlight, index) => (
                <li key={index}>{highlight}</li>
              ))}
              {item.highlights.length > 2 && (
                <li className="text-xs text-primary cursor-pointer" onClick={onSelect}>
                  + {item.highlights.length - 2} more highlights
                </li>
              )}
            </ul>
          )}
        </CardContent>

        <CardFooter className={cn(
          "grid gap-2", 
          (item.live_url && item.github_url) ? "grid-cols-2" : "grid-cols-1"
        )}>
          <Button variant="secondary" size="sm" className="w-full" onClick={onSelect}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
          
          <div className={cn(
            "flex gap-2",
            (item.live_url && item.github_url) ? "w-full justify-end" : "w-full justify-start"
          )}>
            {item.live_url && (
              <Button variant="outline" size="icon" asChild>
                <a href={item.live_url} target="_blank" rel="noopener noreferrer" title="Visit Site">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
            {item.github_url && (
              <Button variant="outline" size="icon" asChild>
                <a href={item.github_url} target="_blank" rel="noopener noreferrer" title="View Code">
                  <Github className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
