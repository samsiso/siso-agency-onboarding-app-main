
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// [Analysis] Component to display analysis data in tabs for better organization
interface AnalysisTabsProps {
  analysis: any;
}

export const AnalysisTabs: React.FC<AnalysisTabsProps> = ({ analysis }) => {
  return (
    <Tabs defaultValue="market" className="w-full">
      <TabsList className="grid grid-cols-4 bg-gray-900/50 border border-gray-800 rounded-md p-1">
        <TabsTrigger value="market" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Market Impact
        </TabsTrigger>
        <TabsTrigger value="technical" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Technical
        </TabsTrigger>
        <TabsTrigger value="related" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Related Tech
        </TabsTrigger>
        <TabsTrigger value="business" className="data-[state=active]:bg-blue-900/30 data-[state=active]:text-blue-300">
          Business
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="market" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-2 text-blue-300">Market Impact Analysis</h3>
        <p className="text-gray-300">{analysis?.market_impact || "No market impact analysis available"}</p>
      </TabsContent>
      
      <TabsContent value="technical" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-2 text-blue-300">Technical Predictions</h3>
        {analysis?.technical_predictions && analysis.technical_predictions.length > 0 ? (
          <ul className="list-disc pl-5 space-y-2 text-gray-300">
            {analysis.technical_predictions.map((prediction: string, index: number) => (
              <li key={index}>{prediction}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-300">No technical predictions available</p>
        )}
      </TabsContent>
      
      <TabsContent value="related" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-2 text-blue-300">Related Technologies</h3>
        {analysis?.related_technologies && analysis.related_technologies.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {analysis.related_technologies.map((tech: string, index: number) => (
              <span key={index} className="bg-gray-800 text-blue-300 px-3 py-1 rounded-full text-sm">
                {tech}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-300">No related technologies identified</p>
        )}
      </TabsContent>
      
      <TabsContent value="business" className="bg-gray-900/30 p-4 rounded-md mt-4 border border-gray-800">
        <h3 className="text-lg font-medium mb-2 text-blue-300">Business Implications for AI Agencies</h3>
        <p className="text-gray-300">{analysis?.business_implications || "No business implications analysis available"}</p>
      </TabsContent>
    </Tabs>
  );
};
