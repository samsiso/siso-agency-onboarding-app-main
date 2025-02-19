
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Bot, Database, Scale } from 'lucide-react';

export const TechnologyBreakdown = () => {
  const techBreakdown = [
    { area: 'AI/ML', percentage: 45 },
    { area: 'Robotics', percentage: 25 },
    { area: 'Research Tools', percentage: 20 },
    { area: 'Policy & Ethics', percentage: 10 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Technology Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {techBreakdown.map(tech => (
          <div key={tech.area} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {tech.area === 'AI/ML' && <Brain className="h-4 w-4 text-blue-500" />}
                {tech.area === 'Robotics' && <Bot className="h-4 w-4 text-green-500" />}
                {tech.area === 'Research Tools' && <Database className="h-4 w-4 text-yellow-500" />}
                {tech.area === 'Policy & Ethics' && <Scale className="h-4 w-4 text-purple-500" />}
                <span>{tech.area}</span>
              </div>
              <span className="font-medium">{tech.percentage}%</span>
            </div>
            <Progress 
              value={tech.percentage} 
              className="h-2"
              indicatorClassName={
                tech.area === 'AI/ML' ? 'bg-blue-500' :
                tech.area === 'Robotics' ? 'bg-green-500' :
                tech.area === 'Research Tools' ? 'bg-yellow-500' :
                'bg-purple-500'
              }
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
