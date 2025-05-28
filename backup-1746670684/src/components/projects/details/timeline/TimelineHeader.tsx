
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

        <div className="bg-purple-500/20 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">Payment Schedule</h3>
          <div className="space-y-2 text-sm text-siso-text">
            <p>Total Budget: <span className="text-white">£6,000</span></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Upfront Payment: £900 (Before Milestone 1)</li>
              <li>Milestone 2: £1,200</li>
              <li>Milestone 4: £1,200</li>
              <li>Milestone 6: £1,200</li>
              <li>Final Payment: £1,500 (Milestone 8)</li>
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}
