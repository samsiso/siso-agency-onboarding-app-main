
import { PortfolioItem } from '@/types/portfolio';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';

interface PortfolioCardProps {
  item: PortfolioItem;
}

export const PortfolioCard = ({ item }: PortfolioCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {item.image_url && (
        <div 
          className="w-full h-48 bg-cover bg-center"
          style={{ backgroundImage: `url(${item.image_url})` }}
        />
      )}
      
      <CardHeader>
        <h3 className="text-xl font-semibold">{item.title}</h3>
        {item.description && (
          <p className="text-muted-foreground">{item.description}</p>
        )}
      </CardHeader>

      <CardContent>
        {item.technologies.length > 0 && (
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

        {item.highlights.length > 0 && (
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {item.highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        )}
      </CardContent>

      <CardFooter className="flex gap-2">
        {item.live_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={item.live_url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Visit Site
            </a>
          </Button>
        )}
        {item.github_url && (
          <Button variant="outline" size="sm" asChild>
            <a href={item.github_url} target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View Code
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
