
import React from 'react';
import { CheckCircle } from 'lucide-react';

export const FeatureInstructions: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-siso-orange/10 border border-siso-orange/30 rounded-lg">
      <h3 className="text-white font-semibold mb-2">How It Works</h3>
      <ul className="space-y-2">
        <li className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
          <span className="text-sm text-siso-text">
            <strong className="text-white">Role-Based Access:</strong> When users log in, they see only the features relevant to their role—models get their dashboard, agency staff get theirs.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
          <span className="text-sm text-siso-text">
            <strong className="text-white">User-Friendly:</strong> The design is simple, so even non-tech-savvy users can navigate it easily.
          </span>
        </li>
        <li className="flex items-start gap-2">
          <CheckCircle className="h-5 w-5 text-siso-orange shrink-0 mt-0.5" />
          <span className="text-sm text-siso-text">
            <strong className="text-white">Scalable:</strong> Built to grow with your agency, including future integrations like SMS and WhatsApp.
          </span>
        </li>
      </ul>
    </div>
  );
};
