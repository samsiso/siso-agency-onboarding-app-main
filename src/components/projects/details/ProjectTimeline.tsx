
import { Card } from '@/components/ui/card';
import { Timeline } from '@/components/ui/timeline';

export function ProjectTimeline() {
  const milestones = [
    {
      title: "Project Initialization",
      content: (
        <div className="bg-black/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">Initial Setup & Planning</h3>
          <ul className="list-disc list-inside space-y-2 text-siso-text">
            <li>Project requirements gathering</li>
            <li>Technical architecture design</li>
            <li>Development environment setup</li>
            <li>Team roles assignment</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Smart Contract Development",
      content: (
        <div className="bg-black/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">Core Contract Features</h3>
          <ul className="list-disc list-inside space-y-2 text-siso-text">
            <li>Token contract implementation</li>
            <li>Security measures integration</li>
            <li>Testing framework setup</li>
            <li>Audit preparation</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Frontend Development",
      content: (
        <div className="bg-black/20 rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">User Interface</h3>
          <ul className="list-disc list-inside space-y-2 text-siso-text">
            <li>Wallet integration</li>
            <li>Transaction interface</li>
            <li>Dashboard development</li>
            <li>Analytics visualization</li>
          </ul>
        </div>
      ),
    },
  ];

  return (
    <Card className="p-8 bg-black/30 border-siso-text/10">
      <Timeline data={milestones} />
    </Card>
  );
}
