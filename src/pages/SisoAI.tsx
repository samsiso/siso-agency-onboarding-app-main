import { Sidebar } from '@/components/Sidebar';
import { FloatingOrbs } from '@/components/effects/FloatingOrbs';

export default function SisoAI() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 bg-gradient-to-b from-siso-bg via-black to-siso-bg relative overflow-hidden">
        <FloatingOrbs />
        
        <div className="container mx-auto p-6 relative z-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-siso-red to-siso-orange text-transparent bg-clip-text mb-6">
            SISO AI
          </h1>
          <p className="text-siso-text/80">
            Explore the latest advancements in AI technology and how they can benefit your business.
          </p>
          <div className="mt-4">
            <h2 className="text-2xl font-semibold text-siso-text-bold">Features</h2>
            <ul className="list-disc list-inside mt-2">
              <li>AI-driven insights and analytics</li>
              <li>Customizable AI solutions</li>
              <li>Integration with existing systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
