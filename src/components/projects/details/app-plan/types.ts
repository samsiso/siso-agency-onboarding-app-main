
import { ReactNode } from 'react';

export interface PhaseSubsection {
  id: string;
  title: string;
  content: ReactNode;
  bestPractices?: string[];
  actionableSteps?: string[];
  expectedOutcomes?: string[];
}

export interface PhaseData {
  id: string;
  title: string;
  description: string;
  subsections: PhaseSubsection[];
}
