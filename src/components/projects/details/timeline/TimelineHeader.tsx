import React from 'react';
import { Card } from '@/components/ui/card';

export function TimelineHeader() {
  return (
    <Card className="bg-black/30 border-siso-text/10 mb-8 p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">UbahCryp Project Timeline</h2>
          <p className="text-siso-text mt-2">Duration: 6 weeks (April 28, 2025 - June 6, 2025)</p>
        </div>
      </div>
    </Card>
  );
}
