import { Star } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EarningTask {
  action: string;
  points: string;
}

interface EarningDetailsProps {
  title: string;
  description: string;
  items: EarningTask[];
}

export const EarningDetails = ({ title, description, items }: EarningDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-siso-text-bold mb-2">{title}</h2>
        <p className="text-siso-text/80">{description}</p>
      </div>

      <div className="grid gap-4">
        {items.map((item, index) => (
          <Card 
            key={index}
            className="p-4 bg-gradient-to-r from-siso-text/5 to-transparent hover:from-siso-text/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-siso-orange" />
                <span className="text-siso-text">{item.action}</span>
              </div>
              <span className="text-siso-orange font-semibold">{item.points}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};