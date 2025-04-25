
import { Card } from '@/components/ui/card';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileCheck, ChevronRight, Clock, ArrowRight, CheckCircle } from 'lucide-react';

export function AppPlanSection() {
  // Mock data for development phases
  const developmentPhases = [
    { 
      name: 'Research & Analysis', 
      status: 'completed', 
      progress: 100,
      startDate: '2025-01-10',
      endDate: '2025-02-15',
      description: 'Market research, competitor analysis, and defining core requirements.',
    },
    { 
      name: 'Planning & Architecture', 
      status: 'completed', 
      progress: 100,
      startDate: '2025-02-20',
      endDate: '2025-03-25',
      description: 'Technical architecture design, system planning, and technology selection.',
    },
    { 
      name: 'Design & Prototyping', 
      status: 'in_progress', 
      progress: 65,
      startDate: '2025-03-30',
      endDate: '2025-05-15',
      description: 'UI/UX design, wireframing, and interactive prototyping.',
    },
    { 
      name: 'Core Development', 
      status: 'upcoming', 
      progress: 0,
      startDate: '2025-05-20',
      endDate: '2025-08-30',
      description: 'Building the core functionality, smart contract development, and backend implementation.',
    },
    { 
      name: 'Testing & QA', 
      status: 'upcoming', 
      progress: 0,
      startDate: '2025-09-01',
      endDate: '2025-10-15',
      description: 'Comprehensive testing, security audits, and quality assurance.',
    },
    { 
      name: 'Deployment & Launch', 
      status: 'upcoming', 
      progress: 0,
      startDate: '2025-10-20',
      endDate: '2025-11-30',
      description: 'Production deployment, soft launch, and official release.',
    }
  ];

  // Mock technical requirements
  const technicalRequirements = [
    { category: 'Frontend', items: ['React Native for mobile apps', 'React with TypeScript for web interface', 'State management with Redux'] },
    { category: 'Backend', items: ['Node.js API layer', 'PostgreSQL database', 'Redis for caching'] },
    { category: 'Blockchain', items: ['Ethereum and Solidity for smart contracts', 'IPFS for decentralized storage', 'MetaMask and WalletConnect integration'] },
    { category: 'Security', items: ['Two-factor authentication', 'End-to-end encryption', 'Smart contract audit by third party'] },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">App Development Plan</h2>
          <p className="text-neutral-400">Comprehensive roadmap for Ubahcrypt's development lifecycle.</p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-[#9b87f5] hover:bg-[#8a76e4] text-white">
            Export Plan
          </Button>
          <Button variant="outline" className="border-white/10 text-white">
            Edit Plan
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <AnimatedCard className="xl:col-span-2 border border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Development Roadmap</h3>
            <div className="space-y-5">
              {developmentPhases.map((phase, index) => (
                <div key={index} className="relative">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      phase.status === 'completed' ? 'bg-green-500/20 text-green-400' : 
                      phase.status === 'in_progress' ? 'bg-[#9b87f5]/20 text-[#9b87f5]' : 
                      'bg-neutral-500/20 text-neutral-400'
                    }`}>
                      {phase.status === 'completed' ? <CheckCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-center">
                        <h4 className="text-white font-medium">{phase.name}</h4>
                        <Badge variant={
                          phase.status === 'completed' ? 'success' : 
                          phase.status === 'in_progress' ? 'purple' : 
                          'secondary'
                        }>
                          {phase.status === 'completed' ? 'Completed' : 
                           phase.status === 'in_progress' ? 'In Progress' : 
                           'Upcoming'}
                        </Badge>
                      </div>
                      <p className="text-sm text-neutral-400">{phase.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span>{phase.startDate}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span>{phase.endDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  {index < developmentPhases.length - 1 && (
                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-white/10 h-6"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard className="border border-white/10">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Technical Requirements</h3>
            <div className="space-y-6">
              {technicalRequirements.map((req, index) => (
                <div key={index}>
                  <h4 className="font-medium text-[#9b87f5] mb-2">{req.category}</h4>
                  <ul className="space-y-1 text-sm">
                    {req.items.map((item, i) => (
                      <li key={i} className="text-neutral-300 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#9b87f5]/70"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="text-[#9b87f5] hover:text-[#8a76e4] mt-4 flex items-center gap-1">
              View full technical specification
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </AnimatedCard>
      </div>

      <AnimatedCard className="border border-white/10">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Dependencies & Risk Assessment</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-[#9b87f5] mb-3">External Dependencies</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">API</Badge>
                  <div>
                    <p className="text-white text-sm">Chainlink Oracle Integration</p>
                    <p className="text-xs text-neutral-400">For real-time price feeds and external data</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">Service</Badge>
                  <div>
                    <p className="text-white text-sm">Crypto Payment Processor</p>
                    <p className="text-xs text-neutral-400">For fiat-to-crypto conversion services</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5">Library</Badge>
                  <div>
                    <p className="text-white text-sm">OpenZeppelin Contracts</p>
                    <p className="text-xs text-neutral-400">For secure smart contract implementation</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium text-[#9b87f5] mb-3">Risk Assessment</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Badge variant="warning" className="mt-0.5">Medium</Badge>
                  <div>
                    <p className="text-white text-sm">Regulatory Compliance</p>
                    <p className="text-xs text-neutral-400">Changing regulations in target markets</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="destructive" className="mt-0.5">High</Badge>
                  <div>
                    <p className="text-white text-sm">Security Vulnerabilities</p>
                    <p className="text-xs text-neutral-400">Smart contract exploits and attacks</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Badge variant="info" className="mt-0.5">Low</Badge>
                  <div>
                    <p className="text-white text-sm">Market Adoption</p>
                    <p className="text-xs text-neutral-400">User acquisition challenges</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </div>
  );
}
