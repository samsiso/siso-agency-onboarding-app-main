import { createContext, useContext, useState, useEffect } from 'react';

export interface PlanData {
  id: string;
  username: string;
  company_name: string | null;
  app_name: string | null;
  features: string[] | null;
  branding: {
    logo?: string;
    primary_color?: string;
    secondary_color?: string;
  } | null;
  estimated_cost: number | null;
  estimated_days: number | null;
  status: string | null;
  created_at?: string; // Added created_at property
}

export interface PainPointDetailProps {
  problem: string;
  statistic: string;
  solution: string;
  detailedSolution: string;
  benefits: string[];
  metrics: { label: string; value: string; icon: JSX.Element }[];
  images: { url: string; caption: string }[];
  caseStudyLink: string;
  title?: string; // Added for compatibility with existing code
  description?: string; // Added for compatibility with existing code
  impact?: string; // Added for compatibility with existing code
  solutions?: string[]; // Added for compatibility with existing code
}

interface PlanContextType {
  planData: PlanData | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setPlanData: (data: PlanData | null) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
  totalTime: number;
  setTotalTime: (time: number) => void;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
  showSolutionsSection: boolean;
  setShowSolutionsSection: (show: boolean) => void;
  showFeatureSelection: boolean;
  setShowFeatureSelection: (show: boolean) => void;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  selectedPainPoint: PainPointDetailProps | null;
  setSelectedPainPoint: (painPoint: PainPointDetailProps | null) => void;
  showPainPointModal: boolean;
  setShowPainPointModal: (show: boolean) => void;
}

const PlanContext = createContext<PlanContextType | undefined>(undefined);

export const PlanProvider = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [selectedColor, setSelectedColor] = useState('#3182CE');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showSolutionsSection, setShowSolutionsSection] = useState(false);
  const [showFeatureSelection, setShowFeatureSelection] = useState(true);
  const [totalTime, setTotalTime] = useState(14);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPainPoint, setSelectedPainPoint] = useState<PainPointDetailProps | null>(null);
  const [showPainPointModal, setShowPainPointModal] = useState(false);

  const value = {
    planData,
    loading,
    setLoading,
    setPlanData,
    selectedColor,
    setSelectedColor,
    selectedFeatures,
    setSelectedFeatures,
    totalTime,
    setTotalTime,
    totalPrice,
    setTotalPrice,
    showSolutionsSection,
    setShowSolutionsSection,
    showFeatureSelection,
    setShowFeatureSelection,
    isSubmitting,
    setIsSubmitting,
    selectedPainPoint,
    setSelectedPainPoint,
    showPainPointModal,
    setShowPainPointModal,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
};

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error('usePlanContext must be used within a PlanProvider');
  }
  return context;
};
