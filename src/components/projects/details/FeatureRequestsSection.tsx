
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

export function FeatureRequestsSection() {
  const [request, setRequest] = useState("");

  return (
    <Card className="p-6 bg-black/30 border-siso-text/10">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-semibold text-white">Feature Requests</h3>
        <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
      </div>
      <div className="space-y-4">
        <Textarea 
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          placeholder="Describe the feature you'd like to request..."
          className="bg-black/20 border-gray-700 text-white"
        />
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Estimated Cost</span>
            <span>£500 - £1,000</span>
          </div>
          <Button 
            className="w-full bg-[#9b87f5] hover:bg-[#9b87f5]/90"
            disabled
          >
            Submit Request (Coming Soon)
          </Button>
        </div>
      </div>
    </Card>
  );
}
