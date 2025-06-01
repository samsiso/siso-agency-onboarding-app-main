/**
 * Dashboard Metrics Utilities
 * Calculates real, meaningful metrics based on user progress
 * instead of fake/static data
 */

export interface UserProgress {
  onboardingProgress: number;
  activeTasks: number;
  projectPhase: string;
  timelineEstimate: string;
  isReadyToLaunch: boolean;
}

/**
 * Calculates onboarding completion percentage based on real data
 */
export const getOnboardingProgress = (): number => {
  const businessData = localStorage.getItem('business-onboarding-data');
  const completedTasks = localStorage.getItem('workflow-completed-tasks');
  
  let score = 0;
  
  // Check business onboarding completion (40% weight)
  if (businessData) {
    const data = JSON.parse(businessData);
    if (data.businessName) score += 10; // Business name provided
    if (data.appPurpose) score += 10;   // App purpose defined
    if (data.industry) score += 10;     // Industry selected
    if (data.completedAt) score += 10;  // Onboarding completed
  }
  
  // Check workflow tasks completion (60% weight)
  if (completedTasks) {
    const completed = JSON.parse(completedTasks);
    // Each task worth ~6.7 points (60 points / 9 tasks)
    score += Math.min(completed.length * 6.7, 60);
  }
  
  return Math.min(Math.round(score), 100);
};

/**
 * Gets count of remaining workflow tasks
 */
export const getActiveTasksCount = (): number => {
  const completedTasks = localStorage.getItem('workflow-completed-tasks');
  const totalWorkflowTasks = 9; // Total workflow tasks available
  
  if (!completedTasks) return totalWorkflowTasks;
  
  const completed = JSON.parse(completedTasks);
  return Math.max(0, totalWorkflowTasks - completed.length);
};

/**
 * Determines current project phase based on progress
 */
export const getProjectPhase = (hasProjects: boolean): string => {
  const onboardingProgress = getOnboardingProgress();
  
  if (hasProjects) {
    return "In Development";
  }
  
  if (onboardingProgress >= 100) return "Ready to Launch";
  if (onboardingProgress >= 60) return "Planning Phase";
  if (onboardingProgress >= 30) return "Requirements";
  return "Getting Started";
};

/**
 * Estimates time until launch/next milestone
 */
export const getTimelineEstimate = (hasProjects: boolean): string => {
  const onboardingProgress = getOnboardingProgress();
  const activeTasks = getActiveTasksCount();
  
  if (hasProjects) {
    return "14-21 days"; // Typical development timeline
  }
  
  if (onboardingProgress >= 100) {
    return "Ready Now";
  }
  
  // Estimate based on remaining tasks (assuming ~1 day per task)
  const estimatedDays = Math.max(1, activeTasks);
  if (estimatedDays === 1) return "1 day";
  if (estimatedDays <= 3) return `${estimatedDays} days`;
  if (estimatedDays <= 7) return "1 week";
  return "2+ weeks";
};

/**
 * Gets complete user progress summary
 */
export const getUserProgress = (hasProjects: boolean): UserProgress => {
  const onboardingProgress = getOnboardingProgress();
  const activeTasks = getActiveTasksCount();
  const projectPhase = getProjectPhase(hasProjects);
  const timelineEstimate = getTimelineEstimate(hasProjects);
  
  return {
    onboardingProgress,
    activeTasks,
    projectPhase,
    timelineEstimate,
    isReadyToLaunch: onboardingProgress >= 100 && !hasProjects
  };
};

/**
 * Gets motivational message based on progress
 */
export const getMotivationalMessage = (progress: UserProgress): string => {
  if (progress.isReadyToLaunch) {
    return "🚀 You're ready to launch your project!";
  }
  
  if (progress.onboardingProgress >= 80) {
    return "🎯 Almost there! Just a few more steps.";
  }
  
  if (progress.onboardingProgress >= 50) {
    return "💪 Great progress! Keep going!";
  }
  
  if (progress.onboardingProgress >= 20) {
    return "🌟 You're getting started! Nice work.";
  }
  
  return "👋 Welcome! Let's get your app journey started.";
};

/**
 * Calculates trend data for metrics
 */
export const getTrendData = (type: 'setup' | 'tasks' | 'project' | 'timeline', progress: UserProgress) => {
  switch (type) {
    case 'setup':
      return progress.onboardingProgress > 0 ? {
        value: Math.min(progress.onboardingProgress, 100),
        isPositive: true,
        period: 'completion'
      } : undefined;
      
    case 'tasks':
      return progress.activeTasks > 0 ? {
        value: Math.max(0, 100 - (progress.activeTasks * 11)),
        isPositive: true,
        period: 'progress'
      } : {
        value: 100,
        isPositive: true,
        period: 'complete'
      };
      
    case 'project':
      if (progress.projectPhase === "In Development") {
        return { value: 65, isPositive: true, period: 'progress' };
      }
      return progress.onboardingProgress >= 80 ? {
        value: 95,
        isPositive: true,
        period: 'ready'
      } : undefined;
      
    case 'timeline':
      if (progress.timelineEstimate === "Ready Now") {
        return { value: 100, isPositive: true, period: 'ready' };
      }
      return progress.timelineEstimate.includes('day') ? {
        value: 80,
        isPositive: true,
        period: 'soon'
      } : undefined;
      
    default:
      return undefined;
  }
}; 