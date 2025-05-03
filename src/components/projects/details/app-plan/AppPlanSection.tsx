
import { useState, useRef, useEffect } from 'react';
import { PhasesNavigation } from './PhasesNavigation';
import { PlanHeader } from './PlanHeader';
import { PhaseSection } from './PhaseSection';
import { phaseData } from './phaseContent';

export function AppPlanSection() {
  const [activePhaseId, setActivePhaseId] = useState("phase-1");
  const phaseSectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Scroll to the active phase section when activePhaseId changes
  useEffect(() => {
    const sectionRef = phaseSectionRefs.current[activePhaseId];
    if (sectionRef) {
      sectionRef.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activePhaseId]);

  const handleSectionRef = (id: string, ref: HTMLDivElement | null) => {
    phaseSectionRefs.current[id] = ref;
  };
  
  return (
    <div className="space-y-8">
      <PlanHeader 
        title="Crypto App Development Plan" 
        description="Comprehensive roadmap for Ubahcrypt's development lifecycle."
      />

      <div className="relative">
        <PhasesNavigation 
          phases={phaseData} 
          activePhaseId={activePhaseId} 
          setActivePhaseId={setActivePhaseId} 
        />

        <div className="mt-8 space-y-12">
          {phaseData.map(phase => (
            <PhaseSection
              key={phase.id}
              id={phase.id}
              title={phase.title}
              description={phase.description}
              subsections={phase.subsections}
              isActive={activePhaseId === phase.id}
              onSectionRef={handleSectionRef}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
